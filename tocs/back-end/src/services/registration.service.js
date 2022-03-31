import Sequelize from "sequelize";
import db from "../models/index";
import { formatAddressPhoneNumbers } from "../utils/mutator";
import { isoToPacificDate } from "../utils/utilities";

const { Op } = Sequelize;
const {
  Address,
  BookCharge,
  ElectiveClass,
  Family,
  Grade,
  InstructorAssignment,
  RegistrationPayment,
  SchoolClass,
  SchoolClassActiveFlag,
  SchoolYear,
  StaffAssignment,
  StudentClassAssignment,
  StudentFeePayment,
  Person,
} = db;

const dollarFields = [
  "registrationFeeInCents",
  "tuitionInCents",
  "pvaMembershipDueInCents",
  "cccaMembershipDueInCents",
  "earlyRegistrationTuitionInCents",
  "tuitionDiscountForThreeOrMoreChildInCents",
  "tuitionDiscountForPreKInCents",
  "tuitionDiscountForInstructorInCents",
];

const initializeSchoolClassActiveFlags = async (schoolYear) => {
  const schoolClasses = await SchoolClass.findAll();
  const promises = schoolClasses.map(async (schoolClass) => {
    const s = await SchoolClassActiveFlag.create({
      schoolClassId: schoolClass.id,
      schoolYearId: schoolYear.id,
    });
    return s;
  });
  return Promise.all(promises);
};

const initializeBookCharges = async (schoolYear) => {
  const grades = await Grade.findAll();
  const promises = grades.map(async (grade) =>
    BookCharge.create({
      gradeId: grade.id,
      schoolYearId: schoolYear.id,
    })
  );
  return Promise.all(promises);
};

const assignPreviousSchoolYearId = async (obj) => {
  if (obj.startDate) {
    const previousSchoolYear =
      await SchoolYear.findPreviousSchoolYearByStartDate(obj.startDate);
    if (previousSchoolYear) {
      Object.assign(obj, { previousSchoolYearId: previousSchoolYear.id });
    }
  }
};

export default {
  getBoard: async () => {
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    const nextSchoolYear = await SchoolYear.nextSchoolYear();
    return { currentSchoolYear, nextSchoolYear };
  },
  getGrades: async () => Grade.findAll(),
  getSchoolClasses: async () =>
    SchoolClass.findAll({ include: [{ model: Grade, as: "grade" }] }),
  getSchoolClass: async (id) => SchoolClass.getById(id),
  getActiveSchoolClasses: async (schoolYearId) =>
    SchoolClass.getActiveSchoolClasses(schoolYearId),
  getActiveSchoolClassesForCurrentNextSchoolYear: async () =>
    SchoolClass.getActiveSchoolClassesForCurrentNextSchoolYear(),
  saveSchoolClass: async (id, obj) => {
    const schoolClass = await SchoolClass.getById(id);
    if (!obj.minAge) {
      Object.assign(obj, { minAge: null });
    }
    if (!obj.maxAge) {
      Object.assign(obj, { maxAge: null });
    }
    Object.assign(schoolClass, obj);
    await schoolClass.save();
  },
  toggleActiveSchoolClass: async (id, schoolYearId, active) => {
    const schoolClass = await SchoolClass.getById(id);
    await schoolClass.flipActiveTo(schoolYearId, active);
    return `ActiveSchoolClass updated ${id} ${schoolYearId}`;
  },
  addSchoolClass: async (obj) => {
    if (!obj.minAge) {
      Object.assign(obj, { minAge: null });
    }
    if (!obj.maxAge) {
      Object.assign(obj, { maxAge: null });
    }
    if (!obj.gradeId) {
      Object.assign(obj, { gradeId: null });
    }
    const schoolClass = await SchoolClass.create(obj);
    const schoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    const promises = schoolYears.map(async (schoolYear) => {
      const s = await SchoolClassActiveFlag.create();
      await s.setSchoolClass(schoolClass.id);
      await s.setSchoolYear(schoolYear.id);
    });
    Promise.all(promises);
  },
  getSchoolYears: async () => SchoolYear.findAll(),
  getSchoolYear: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    dollarFields.forEach((s) => {
      schoolYear.dataValues[s.replace("InCents", "")] = schoolYear[s] / 100;
    });
    return schoolYear;
  },
  saveSchoolYear: async (id, obj) => {
    const schoolYear = await SchoolYear.getById(id);
    Object.assign(schoolYear, obj);
    dollarFields.forEach((s) => {
      schoolYear[s] = obj[s.replace("InCents", "")] * 100;
    });
    await schoolYear.save();
  },
  getBookCharges: async (schoolYearId) => {
    const bookCharges = await BookCharge.findAllForSchoolYear(schoolYearId);
    bookCharges.forEach((bookCharge) =>
      ["bookChargeInCents"].forEach((s) =>
        Object.assign(bookCharge.dataValues, {
          [s.replace("InCents", "")]: bookCharge[s] / 100,
        })
      )
    );
    return bookCharges;
  },
  saveBookCharges: async (schoolYearId, obj) => {
    const bookCharges = await BookCharge.findAllForSchoolYear(schoolYearId);
    const bcObj = bookCharges.reduce(
      (result, current) => Object.assign(result, { [current.id]: current }),
      {}
    );
    const promises = Object.entries(obj).map(async ([key, value]) => {
      bcObj[key].bookChargeInCents = value * 100;
      await bcObj[key].save();
    });
    return Promise.all(promises);
  },
  toggleAutoClassAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    schoolYear.autoClassAssignment = !schoolYear.autoClassAssignment;
    return schoolYear.save();
  },

  addSchoolYear: async (obj) => {
    await assignPreviousSchoolYearId(obj);
    const schoolYear = await SchoolYear.create(obj);
    await initializeSchoolClassActiveFlags(schoolYear);
    await initializeBookCharges(schoolYear);
    return schoolYear;
  },
  getStaffAssignments: async () =>
    SchoolYear.findAll({ where: { id: { [Op.gt]: 8 } } }),
  getStaffAssignment: async (id) => {
    const schoolYear = await SchoolYear.getById(id);
    const staffAssignments = await StaffAssignment.findAll({
      include: [{ model: Person, as: "person" }],
      where: { schoolYearId: { [Op.eq]: id } },
    });
    return { schoolYear, staffAssignments };
  },
  addFamily: async ({
    email,
    firstName,
    lastName,
    gender,
    street,
    city,
    state,
    zipcode,
    homePhone,
    cellPhone,
  }) => {
    const family = await Family.createWith({
      parentOne: { firstName, lastName, gender },
      address: {
        street,
        city,
        state,
        email,
        zipcode,
        homePhone,
        cellPhone,
      },
    });
    return family;
  },
  getFamily: async (id) => {
    const families = await Family.findAll({
      include: [
        { model: Person, as: "parentOne" },
        { model: Person, as: "parentTwo" },
        { model: Person, as: "children" },
        { model: Address, as: "address" },
      ],
      where: { id: { [Op.eq]: id } },
    });
    if (families && families.length) {
      return formatAddressPhoneNumbers(JSON.parse(JSON.stringify(families[0])));
    }
    return null;
  },
  getPeople: async ({ limit, offset, searchText }) => {
    const obj = { limit, offset };
    if (searchText) {
      if (searchText.includes(" ")) {
        const sp = searchText.split(" ");
        obj.where = {
          [Op.and]: [
            { lastName: { [Op.iLike]: `%${sp[1]}%` } },
            { firstName: { [Op.iLike]: `%${sp[0]}%` } },
          ],
        };
      } else {
        obj.where = {
          [Op.or]: [
            { lastName: { [Op.iLike]: `%${searchText}%` } },
            { firstName: { [Op.iLike]: `%${searchText}%` } },
            { chineseName: { [Op.iLike]: `%${searchText}%` } },
          ],
        };
      }
    }
    return Person.findAndCountAll(obj);
  },
  getPerson: async (id) => {
    const list = await Person.findAll({
      where: { id },
      include: [{ model: Address, as: "address" }],
    });
    const person = list && list.length && list[0];
    let allFamilies = [];
    if (person) {
      const dbFamilies = await person.families();
      if (dbFamilies && dbFamilies.length > 0) {
        allFamilies = await Family.findAll({
          include: [
            { model: Person, as: "parentOne" },
            { model: Person, as: "parentTwo" },
            { model: Person, as: "children" },
            { model: Address, as: "address" },
          ],
          where: { id: { [Op.in]: dbFamilies.map((f) => f.id) } },
        });
      }
    }

    const schoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    const promises = schoolYears.map((schoolYear) =>
      person.getInstructorAssignmentsForSchoolYear(schoolYear.id)
    );
    const ias = await Promise.all(promises);
    const instructorAssignments = ias.reduce((r, c) => r.concat(c), []);
    const studentFeePayments = await StudentFeePayment.findAll({
      where: { studentId: id },
      include: [
        {
          model: RegistrationPayment,
          as: "registrationPayment",
          where: { paid: true },
        },
      ],
      order: [["updated_at", "DESC"]],
    });
    const transactions = studentFeePayments.map((studentFeePayment) => ({
      id: studentFeePayment.registrationPayment.id,
      date: studentFeePayment.updatedAt,
      transactionType:
        studentFeePayment.registrationPayment.grandTotalInCents < 0
          ? "System Adjustment"
          : "Registration",
      paymentMethod: "Credit Card",
    }));
    return formatAddressPhoneNumbers(
      JSON.parse(
        JSON.stringify({
          person,
          families: allFamilies,
          instructorAssignments,
          transactions,
          studentFeePayments,
        })
      )
    );
  },
  getGradeStudentCount: async (schoolYearId) => {
    const sca = await StudentClassAssignment.getGradeStudentCount(schoolYearId);
    const xsca = JSON.parse(JSON.stringify(sca));
    const obj = xsca.reduce(
      (r, c) =>
        Object.assign(r, {
          [c.grade.id]: {
            cnt: c.cnt,
            grade: c.grade,
            maxSize: 0,
          },
        }),
      {}
    );

    const schoolClasses = await SchoolClass.getActiveSchoolClasses(
      schoolYearId
    );
    schoolClasses.forEach((schoolClass) => {
      if (schoolClass.gradeId && schoolClass.maxSize) {
        const x = obj[schoolClass.gradeId];
        if (x) {
          x.maxSize += schoolClass.maxSize;
        }
      }
    });
    const title = (await SchoolYear.getById(schoolYearId)).name;
    return {
      title,
      items: Object.keys(obj)
        .sort((a, b) => a - b)
        .reduce((result, key) => result.concat(obj[key]), []),
    };
  },
  getSchoolClassStudentCount: async (schoolYearId, elective) => {
    const schoolClasses = elective
      ? await SchoolClass.getElectiveSchoolClass(schoolYearId)
      : await SchoolClass.getNonElectiveSchoolClass(schoolYearId);
    const promises = [];
    schoolClasses.forEach((schoolClass) => {
      promises.push(
        (async () => {
          const size = await schoolClass.getClassSize(schoolYearId);
          Object.assign(schoolClass.dataValues, { size });
        })()
      );
      Object.values(schoolClass.dataValues.instructorAssignments).forEach(
        (ias) => {
          ias.forEach(async (ia) => {
            promises.push(
              (async () => {
                const contactInformation =
                  await ia.instructor.getPersonalContactInformation();
                if (contactInformation) {
                  Object.assign(
                    ia.instructor.dataValues,
                    formatAddressPhoneNumbers(contactInformation)
                  );
                }
              })()
            );
          });
        }
      );
    });
    await Promise.all(promises);
    const title = (await SchoolYear.getById(schoolYearId)).name;
    const sortFn = (a, b) =>
      elective
        ? a.englishName.localeCompare(b.englishName)
        : a.gradeId - b.gradeId;
    return {
      title,
      items: schoolClasses.sort(sortFn),
    };
  },
  getSiblingInSameGrade: async (schoolYearId) => {
    let sql =
      "SELECT fc.family_id, sca.grade_id, sca.student_id, sca.school_class_id";
    sql += " FROM student_class_assignments AS sca";
    sql +=
      " INNER JOIN families_children AS fc ON sca.student_id = fc.child_id";
    sql += ` WHERE sca.school_year_id = ${schoolYearId}`;
    sql += " ORDER BY sca.grade_id, sca.school_class_id, fc.family_id";

    let previousResult = {};

    const [rows] = await db.sequelize.query(sql);
    const results = [];
    const studentMap = {};
    const familyMap = {};
    const gradeMap = {};
    const schoolClassMap = {};
    const addRecord = (familyId, gradeId, studentId, schoolClassId) => {
      studentMap[studentId] = {};
      familyMap[familyId] = {};
      gradeMap[gradeId] = {};
      schoolClassMap[schoolClassId] = {};
      results.push({
        studentId,
        familyId,
        gradeId,
        schoolClassId,
      });
    };
    rows.forEach((row) => {
      if (
        row.family_id === previousResult.family_id &&
        row.grade_id === previousResult.grade_id
      ) {
        addRecord(
          row.family_id,
          row.grade_id,
          row.student_id,
          row.school_class_id
        );
        addRecord(
          previousResult.family_id,
          previousResult.grade_id,
          previousResult.student_id,
          row.school_class_id
        );
      } else {
        previousResult = row;
      }
    });

    const families = await Family.findAll({
      where: { id: { [Sequelize.Op.in]: Object.keys(familyMap) } },
      include: [
        { model: Person, as: "parentOne" },
        { model: Person, as: "parentTwo" },
        { model: Address, as: "address" },
      ],
    });
    families.forEach((f) => {
      familyMap[f.id] = f;
    });

    const grades = await Grade.findAll({
      where: { id: { [Sequelize.Op.in]: Object.keys(gradeMap) } },
    });
    grades.forEach((g) => {
      gradeMap[g.id] = g;
    });

    const students = await Person.findAll({
      where: { id: { [Sequelize.Op.in]: Object.keys(studentMap) } },
    });
    students.forEach((s) => {
      studentMap[s.id] = s;
    });

    const schoolClasses = await SchoolClass.findAll({
      where: { id: { [Sequelize.Op.in]: Object.keys(schoolClassMap) } },
    });
    schoolClasses.forEach((s) => {
      schoolClassMap[s.id] = s;
    });

    results.forEach((result) =>
      Object.assign(result, {
        student: studentMap[result.studentId],
        family: familyMap[result.familyId],
        grade: gradeMap[result.gradeId],
        schoolClass: schoolClassMap[result.schoolClassId],
      })
    );

    return formatAddressPhoneNumbers(JSON.parse(JSON.stringify(results)));
  },
  getInstructorAssignmentForm: async (id) => {
    const schoolYears = await SchoolYear.findCurrentAndFutureSchoolYears();
    const schoolClasses =
      await SchoolClass.getActiveSchoolClassesForCurrentAndFutureSchoolYears();
    const roles = Object.values(InstructorAssignment.prototype.roleNames);
    const result = {
      schoolYears,
      schoolClasses,
      roles,
    };
    if (id) {
      result.instructorAssignment = await InstructorAssignment.getById(id);
    }
    return result;
  },
  addInstructorAssignment: async (instructorId, obj) => {
    const { role, schoolYearId, schoolClassId, startDate, endDate } = obj;
    const schoolYear = await SchoolYear.getById(schoolYearId);
    await InstructorAssignment.create({
      role,
      schoolYearId,
      schoolClassId,
      startDate: startDate || schoolYear.startDate,
      endDate: endDate || schoolYear.endDate,
      instructorId,
    });

    const person = await Person.getById(instructorId);
    await person.adjustUserRole();
  },

  saveInstructorAssignment: async (id, obj) => {
    const instructorAssignment = await InstructorAssignment.getById(id);
    Object.assign(instructorAssignment, obj);
    await instructorAssignment.save();

    const person = await Person.getById(instructorAssignment.instructorId);
    await person.adjustUserRole();
  },

  deleteInstructorAssignment: async (id) => {
    const instructorAssignment = await InstructorAssignment.getById(id);
    const personId = instructorAssignment.instructorId;
    await instructorAssignment.destroy();

    const person = await Person.getById(personId);
    await person.adjustUserRole();
    return "deleted";
  },

  getStudents: async (_schoolYearId) => {
    let schoolYearId = _schoolYearId;
    if (!_schoolYearId) {
      const currentSchoolYear = await SchoolYear.currentSchoolYear();
      schoolYearId = currentSchoolYear.id;
    }

    const studentClassAssignments = await StudentClassAssignment.findAll({
      where: { [Op.not]: { schoolClassId: null }, schoolYearId },
      include: [
        { model: Person, as: "student" },
        { model: SchoolClass, as: "schoolClass" },
      ],
      order: [
        ["schoolClass", "short_name", "ASC"],
        ["student", "english_last_name", "ASC"],
        ["student", "english_first_name", "ASC"],
      ],
    });

    return studentClassAssignments.reduce((r, c) => {
      Object.assign(c.student.dataValues, {
        className: c.schoolClass.shortName,
      });
      return r.concat(c.student);
    }, []);
  },

  getDailyOnlineRegistrationSummary: async (schoolYearId) => {
    const tmp = await RegistrationPayment.findPaidPaymentsForSchoolYear(
      schoolYearId
    );
    const obj = {};
    tmp.forEach((x) => {
      const paymentDate = isoToPacificDate(x.updatedAt);

      if (!obj[paymentDate]) {
        obj[paymentDate] = {
          paymentDate,
          studentCount: 0,
          registrationFeeInCents: 0,
          tuitionInCents: 0,
          bookChargeInCents: 0,
          pvaDueInCents: 0,
          cccaDueInCents: 0,
          grandTotalInCents: 0,
        };
      }

      const n = obj[paymentDate];
      n.studentCount +=
        (x.grandTotalInCents < 0 ? -1 : 1) * x.studentFeePayments.length;
      n.grandTotalInCents += x.grandTotalInCents;
      n.pvaDueInCents += x.pvaDueInCents;
      n.cccaDueInCents += x.cccaDueInCents;

      x.studentFeePayments.forEach((studentFeePayment) => {
        n.registrationFeeInCents += studentFeePayment.registrationFeeInCents;
        n.tuitionInCents += studentFeePayment.tuitionInCents;
        n.bookChargeInCents += studentFeePayment.bookChargeInCents;
      });
    });
    return Object.keys(obj)
      .sort((a, b) => b - a)
      .reduce((r, c) => {
        [
          "registrationFeeInCents",
          "tuitionInCents",
          "bookChargeInCents",
          "grandTotalInCents",
          "pvaDueInCents",
          "cccaDueInCents",
        ].forEach((s) =>
          Object.assign(obj[c], { [s.replace("InCents", "")]: obj[c][s] / 100 })
        );
        return r.concat(obj[c]);
      }, []);
  },

  getActiveStudentsByName: async () => {
    const currentSchoolYear = await SchoolYear.currentSchoolYear();
    const schoolYearId = currentSchoolYear.id;
    const sca = await StudentClassAssignment.findAll({
      where: { schoolYearId, [Op.not]: { school_class_id: null } },
      include: [
        { model: Person, as: "student" },
        { model: SchoolClass, as: "schoolClass" },
        { model: ElectiveClass, as: "electiveClass" },
      ],
      order: [
        ["student", "english_last_name", "ASC"],
        ["student", "english_first_name", "ASC"],
      ],
    });
    return sca.map((s) => ({
      student: s.student,
      schoolClass: s.schoolClass,
      electiveClass: s.electiveClass,
    }));
  },
};
