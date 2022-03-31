import Sequelize from "sequelize";
import config from "config";
import db from "../models/index";
import CreditCard from "../utils/credit-card";
import { toExp4Digits, todayPacific } from "../utils/utilities";
import { process } from "../utils/payment-gateway";
import { sendPaymentConfirmation } from "../utils/email";

const { Op } = Sequelize;
const {
  Address,
  Family,
  GatewayTransaction,
  Grade,
  ManualTransaction,
  Person,
  RegistrationPayment,
  PaidBy,
  RegistrationPreference,
  SchoolClass,
  SchoolYear,
  Student,
  StudentClassAssignment,
  StudentFeePayment,
  StudentStatusFlag,
  User,
} = db;

const getRegistrationPayment = async (id, allGatewayTransactions) => {
  const gatewayTransactionOption = {
    model: GatewayTransaction,
    as: "gatewayTransactions",
  };
  if (!allGatewayTransactions) {
    gatewayTransactionOption.where = {
      approvalStatus:
        GatewayTransaction.prototype.status.APPROVAL_STATUS_APPROVED,
    };
  }
  const registrationPayment = await RegistrationPayment.findOne({
    where: { id },
    include: [
      {
        model: PaidBy,
        as: "paidBy",
      },
      gatewayTransactionOption,
      {
        model: StudentFeePayment,
        as: "studentFeePayments",
        include: [
          {
            model: Student,
            as: "student",
          },
        ],
      },
      { model: SchoolYear, as: "schoolYear" },
    ],
  });
  // Query student registrationPreferences here instead of including it in above to avoid long identifiers
  if (registrationPayment && registrationPayment.studentFeePayments) {
    const promises = registrationPayment.studentFeePayments.map(
      async (studentFeePayment) => {
        const { student } = studentFeePayment;
        const schoolYearId = registrationPayment.schoolYear.id;
        const registrationPreference =
          await student.getRegistrationPreferenceForSchoolYear(schoolYearId);
        student.dataValues.registrationPreference = registrationPreference;
      }
    );
    await Promise.all(promises);
  }
  return { registrationPayment };
};

const setSchoolClassBasedOn = async (
  registrationPreference,
  schoolYearId,
  gender
) => {
  const activeGradeClasses =
    await registrationPreference.grade.getActiveGradeClasses(schoolYearId);
  const filtered = activeGradeClasses.filter(
    (s) => s.schoolClassType === registrationPreference.schoolClassType
  );
  if (!filtered) {
    return null;
  }
  if (filtered.length === 1) {
    return filtered[0].id;
  }

  /*
   * If there are more than one school class assignable,
   * don't assign automatically if the flag is not set in school year
   */
  const schoolYear = await SchoolYear.getById(schoolYearId);
  if (!schoolYear.autoClassAssignment) {
    return null;
  }

  const c = await StudentClassAssignment.getLowestSchoolClassByGender(
    schoolYearId,
    gender,
    activeGradeClasses.map((s) => s.id)
  );
  console.log(c);
  return c && c.id;
};

const createStudentClassAssignments = async (registrationPayment) => {
  const promises = registrationPayment.studentFeePayments.map(
    async (studentFeePayment) => {
      const { schoolYearId } = registrationPayment;
      const { student } = studentFeePayment;
      let studentStatusFlag = await student.studentStatusFlagFor(schoolYearId);
      if (studentStatusFlag && studentStatusFlag.registered) {
        return;
      }
      const studentId = student.id;
      if (!studentStatusFlag) {
        studentStatusFlag = { schoolYearId, studentId };
        studentStatusFlag = await StudentStatusFlag.create(studentStatusFlag);
      }
      let studentClassAssignment =
        (await student.getStudentClassAssignmentForSchoolYear(
          schoolYearId
        )) || { schoolYearId, studentId };
      const registrationPreference =
        await student.getRegistrationPreferenceForSchoolYear(schoolYearId);
      studentClassAssignment.gradeId = registrationPreference.grade.id;
      studentClassAssignment.schoolClassId = await setSchoolClassBasedOn(
        registrationPreference,
        schoolYearId,
        student.gender
      );
      studentClassAssignment.electiveClassId =
        registrationPreference.electiveClassId;
      if (!studentClassAssignment.id) {
        studentClassAssignment = await StudentClassAssignment.create(
          studentClassAssignment
        );
      } else {
        await studentClassAssignment.save();
      }

      studentStatusFlag.registered = true;
      studentStatusFlag.lastStatusChangeDate = todayPacific();
      await studentStatusFlag.save();
    }
  );

  await Promise.all(promises);
};

export default {
  addParent: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const person = await Person.create(obj);
    await family.setParentTwo(person.id);
  },
  addChild: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const child = await Person.create(obj);
    await family.addChild(child.id);
  },
  getPerson: async (personId) => Person.getById(personId),
  savePerson: async (personId, obj) => {
    const person = await Person.getById(personId);
    Object.assign(person, obj);
    await person.save();
  },
  // Addresses
  getFamilyAddress: async (familyId) => {
    const family = await Family.getById(familyId);
    return family.getAddress();
  },
  getPersonalAddress: async (personId) => {
    const person = await Person.getById(personId);
    return person.getAddress();
  },
  saveFamilyAddress: async (familyId, obj) => {
    const family = await Family.getById(familyId);
    const address = await family.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  savePersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const address = await person.getAddress();
    Object.assign(address, obj);
    await address.save();
  },
  addPersonalAddress: async (personId, obj) => {
    const person = await Person.getById(personId);
    const savedAddress = await Address.create(obj);
    await person.setAddress(savedAddress.id);
  },
  getTransactionHistoryByUser: async (userId) => {
    const user = await User.getById(userId);
    const { personId } = user;
    const manualTransactions = await ManualTransaction.findTransactionBy(
      personId
    );
    const registrationPayments =
      await RegistrationPayment.findPaidPaymentsPaidBy(personId);
    registrationPayments.forEach((registrationPayment) =>
      ["grandTotalInCents", "cccaDueInCents", "pvaDueInCents"].forEach((s) =>
        Object.assign(registrationPayment.dataValues, {
          [s.replace("InCents", "")]: registrationPayment[s] / 100,
        })
      )
    );
    return { manualTransactions, registrationPayments };
  },
  getRegistrationPayment,
  saveRegistrationPreferences: async (personId, registrationPreferences) => {
    // There could be orphan registrationPreference
    const promises = registrationPreferences.map(
      async (registrationPreference) => {
        const existing = await RegistrationPreference.findOne({
          where: {
            studentId: registrationPreference.studentId,
            schoolYearId: registrationPreference.schoolYearId,
          },
        });
        if (existing) {
          Object.assign(existing, { ...registrationPreference });
          return existing.save();
        }
        const toBeSaved = Object.assign(registrationPreference, {
          entered_by_id: personId,
          grade_id: registrationPreference.gradeId,
        });
        return RegistrationPreference.create(toBeSaved);
      }
    );
    const saved = await Promise.all(promises);
    const students = await Person.findAll({
      where: { id: { [Op.in]: saved.map((p) => p.studentId) } },
      order: [["birth_year"], ["birth_month"]],
    });
    const person = await Person.getById(personId);
    return { students, person, registrationPreferences: saved };
  },
  initializeRegistrationPayment: async (personId, ids) => {
    if (ids) {
      const person = await Person.getById(personId);
      const registrationPreferences = await RegistrationPreference.findAll({
        where: { id: { [Op.in]: ids } },
        include: [
          { model: Grade, as: "grade" },
          { model: SchoolYear, as: "schoolYear" },
          { model: Student, as: "student" },
        ],
      });
      const schoolYearId =
        registrationPreferences &&
        registrationPreferences.length &&
        registrationPreferences[0].schoolYear.id;
      const children = await person.findChildren();
      const paidStudentFeePaymentsInFamilyPromises = await Promise.all(
        children.map(async (student) =>
          student.findPaidStudentFeePaymentAsStudentFor(schoolYearId)
        )
      );
      const paidStudentFeePaymentsInFamily =
        paidStudentFeePaymentsInFamilyPromises.reduce(
          (r, c) => r.concat(c),
          []
        );
      const registrationPayment = {};
      registrationPayment.studentFeePayments = [];
      registrationPayment.paid_by_id = personId;
      let schoolYear = null;

      await registrationPreferences.reduce(
        (p, registrationPreference) =>
          p.then(async () => {
            registrationPayment.schoolYearId =
              registrationPreference.schoolYear.id;
            const studentFeePayment = {};
            studentFeePayment.studentId = registrationPreference.student.id;
            await StudentFeePayment.fillInTuitionAndFee(
              studentFeePayment,
              personId,
              registrationPreference.schoolYear,
              registrationPreference.grade,
              paidStudentFeePaymentsInFamily.concat(
                registrationPayment.studentFeePayments
              )
            );
            registrationPayment.studentFeePayments.push(studentFeePayment);
            schoolYear = registrationPreference.schoolYear;
          }),
        Promise.resolve()
      );

      await RegistrationPayment.fillInDue(
        registrationPayment,
        paidStudentFeePaymentsInFamily.length,
        schoolYear
      );
      RegistrationPayment.calculateGrandTotal(registrationPayment);
      const savedRegistrationPayment = await RegistrationPayment.createWith(
        registrationPayment
      );
      return getRegistrationPayment(savedRegistrationPayment.id, true);
    }
    return null;
  },
  getStudentRegistrationDisplayOptions: async (schoolYearId, personId) => {
    const schoolYear = await SchoolYear.findOne({
      where: { id: schoolYearId },
      include: [{ model: SchoolYear, as: "previousSchoolYear" }],
    });
    const { previousSchoolYear } = schoolYear;
    const previousSchoolYearId = previousSchoolYear.id;
    const person = await Person.getById(personId);
    const children = await person.findChildren();
    const registeredStudents = [];
    const registrationPreferences = [];
    const electiveClasses = await SchoolClass.getElectiveSchoolClass(
      schoolYearId
    );
    const electiveClassSizes =
      await StudentClassAssignment.getElectiveClassSizes(schoolYearId);
    const filteredElectiveClasses = electiveClasses.filter(
      (c) => !electiveClassSizes[c.id] || electiveClassSizes[c.id] < c.maxSize
    );
    const promises = children.map(async (student) => {
      const studentStatusFlag = await student.studentStatusFlagFor(
        schoolYearId
      );
      if (studentStatusFlag && studentStatusFlag.registered) {
        Object.assign(student.dataValues, {
          registrationPreference:
            await student.getRegistrationPreferenceForSchoolYear(schoolYearId),
        });
        registeredStudents.push(student);
      } else {
        const registrationPreference = { schoolYear, student };

        const previousSchoolYearClassAssignment =
          await student.getStudentClassAssignmentForSchoolYear(
            previousSchoolYearId
          );
        const schoolAge = student.schoolAgeFor(schoolYear);
        if (previousSchoolYearClassAssignment) {
          registrationPreference.previousGrade =
            previousSchoolYearClassAssignment.grade;
          registrationPreference.grade = await Grade.snapDownToFirstActiveGrade(
            registrationPreference.previousGrade.nextGrade.id,
            schoolYearId
          );
        } else {
          registrationPreference.grade = await Grade.findBySchoolAge(schoolAge);
        }

        // Cannot find grade, skip
        if (!registrationPreference.grade) {
          return;
        }

        registrationPreference.gradeFull =
          await registrationPreference.grade.gradeFull(schoolYearId);
        registrationPreference.availableSchoolClassTypes =
          await registrationPreference.grade.findAvailableSchoolClassTypes(
            schoolYearId
          );

        const previousSchoolClassAssignment =
          await student.getStudentClassAssignmentForSchoolYear(
            previousSchoolYearId
          );
        /*
         * if previous grade is EC1, then only EC2 can be selected this year.
         * if previous grade is not EC1, then EC2 is not avaliable this year.
         */
        if (
          previousSchoolClassAssignment &&
          previousSchoolClassAssignment.grade.id === 2
        ) {
          if (
            previousSchoolClassAssignment.schoolClass.schoolClassType === "EC"
          ) {
            registrationPreference.availableSchoolClassTypes = ["EC"];
          } else {
            registrationPreference.availableSchoolClassTypes =
              registrationPreference.availableSchoolClassTypes.filter(
                (c) => c !== "EC"
              );
          }
        }

        // For K, EC only allow school year 5 to 8
        if (
          registrationPreference.grade.id === 2 &&
          (schoolAge < 5 || schoolAge > 8)
        ) {
          registrationPreference.availableSchoolClassTypes =
            registrationPreference.availableSchoolClassTypes.filter(
              (c) => c !== "EC"
            );
        }

        const promisesSchoolClassTypes =
          registrationPreference.availableSchoolClassTypes.map(
            async (schoolClassType) => {
              const isFull = await registrationPreference.grade.fullFor(
                schoolYearId,
                schoolClassType
              );
              return {
                schoolClassType,
                isFull,
                text: SchoolClass.getSchoolClassTypeName(schoolClassType),
              };
            }
          );

        registrationPreference.availableSchoolClassTypes = await Promise.all(
          promisesSchoolClassTypes
        );

        // Filter full
        registrationPreference.fullSchoolClassTypes =
          registrationPreference.availableSchoolClassTypes.filter(
            (c) => c.isFull
          );
        registrationPreference.availableSchoolClassTypes =
          registrationPreference.availableSchoolClassTypes.filter(
            (c) => !c.isFull
          );

        // Default to first available schoolClassType
        registrationPreference.schoolClassType =
          registrationPreference.availableSchoolClassTypes &&
          registrationPreference.availableSchoolClassTypes.length &&
          registrationPreference.availableSchoolClassTypes[0].schoolClassType;

        // Elective classes
        registrationPreference.availableElectiveSchoolClasses =
          filteredElectiveClasses
            .filter(
              (c) =>
                !(
                  (c.minAge && schoolAge < c.minAge) ||
                  (c.maxAge && schoolAge > c.maxAge)
                )
            )
            .map((c) => ({ id: c.id, text: c.name() }));

        registrationPreferences.push(registrationPreference);
      }
    });

    await Promise.all(promises);

    return {
      person,
      schoolYear,
      registeredStudents,
      registrationPreferences: registrationPreferences.sort(
        (a, b) => a.student.birthYear - b.student.birthYear
      ),
    };
  },
  savePayment: async (personId, paymentId, obj) => {
    const registrationPayment = await RegistrationPayment.findOne({
      where: { id: paymentId },
      include: [
        { model: PaidBy, as: "paidBy" },
        {
          model: StudentFeePayment,
          as: "studentFeePayments",
          include: [
            {
              model: Student,
              as: "student",
              include: [{ model: StudentStatusFlag, as: "studentStatusFlags" }],
            },
          ],
        },
        { model: SchoolYear, as: "schoolYear" },
      ],
    });
    const rtn = { registrationPayment, message: "" };
    if (registrationPayment.paid) {
      throw new Error("Already paid.");
    }
    if (
      registrationPayment.getStudentStatusFlags().filter((x) => x.registered)
        .length > 0
    ) {
      throw new Error(
        "At least one student in the attempted payment has already registered."
      );
    }
    const cv = new CreditCard(
      obj.number,
      toExp4Digits(obj.year, obj.month),
      obj.cardCode
    ).validate();
    // Accepted credit card types
    if (!cv.isValid) {
      throw new Error(cv.error);
    }

    const gatewayTransaction = await GatewayTransaction.create({
      registrationPaymentId: registrationPayment.id,
      amountInCents: registrationPayment.grandTotalInCents,
      creditCardType: cv.type,
      creditCardLastDigits: cv.last4,
    });

    const resp = await process({
      invoiceNumber: gatewayTransaction.id,
      amount: registrationPayment.grandTotalInCents / 100,
      creditCard: cv.toPaymentGatewayCreditCard(),
    });

    gatewayTransaction.setApprovalStatusBasedOnAuthorizeNetResponse(
      resp.responseCode
    );
    gatewayTransaction.responseDump = resp.response;
    if (resp.successful) {
      gatewayTransaction.approvalCode = resp.authorizationCode;
      gatewayTransaction.referenceNumber = resp.transactionId;
    } else {
      gatewayTransaction.errorMessage = resp.errorMessage;
    }
    await gatewayTransaction.save();

    if (
      gatewayTransaction.approvalStatus ===
      GatewayTransaction.prototype.status.APPROVAL_STATUS_APPROVED
    ) {
      registrationPayment.paid = true;
      await registrationPayment.save();

      await createStudentClassAssignments(registrationPayment);
      // TODO
      // Email here
      const contactInfo =
        await registrationPayment.paidBy.getPersonalContactInformation();
      const recipient = contactInfo.email;
      sendPaymentConfirmation({ recipient });
    } else {
      const s =
        "Payment DECLINED by bank." +
        " Please use a different credit card to try again" +
        ` or contact ${config.get("contacts").webSiteSupport}`;
      throw new Error(s);
    }
    return rtn;
  },
  createStudentClassAssignments,
};
