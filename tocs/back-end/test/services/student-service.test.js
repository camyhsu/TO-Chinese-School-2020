import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import StudentService from "../../src/services/student.service";
import {
  randPerson,
  createRandSchoolClass,
  randString,
  createRandSchoolYear,
} from "../../src/utils/utilities";
import db from "../../src/models/index";

chai.use(chaiAsPromised);
const { expect } = chai;
const {
  Grade,
  Person,
  RegistrationPayment,
  RegistrationPreference,
  SchoolClass,
  SchoolClassActiveFlag,
  SchoolYear,
  StudentStatusFlag,
} = db;

describe("Test Student service", () => {
  describe("savePayment", () => {
    it("savePayment - Already paid", async () => {
      const studentId = (await Person.create(randPerson())).id;
      const schoolYearId = 1;
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId,
        studentFeePayments: [
          {
            studentId,
            bookChargeInCents: 10000,
            registrationFeeInCents: 10000,
            tuitionInCents: 10000,
          },
        ],
        paid: true,
      });
      const paymentId = payment.id;
      const personId = 123;
      const obj = {
        number: "4532928211171666",
        year: "2022",
        month: "2",
        cardCode: "123",
      };
      await expect(
        StudentService.savePayment(personId, paymentId, obj)
      ).to.eventually.be.rejectedWith("Already paid.");
    });

    it("savePayment - already registered", async () => {
      const studentId = (await Person.create(randPerson())).id;
      const schoolYearId = 1;
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId: 1,
        studentFeePayments: [
          {
            studentId,
            bookChargeInCents: 10000,
            registrationFeeInCents: 10000,
            tuitionInCents: 10000,
          },
        ],
      });
      await StudentStatusFlag.create({
        studentId,
        schoolYearId,
        registered: true,
      });
      const paymentId = payment.id;
      const personId = 123;
      await expect(
        StudentService.savePayment(personId, paymentId, null)
      ).to.eventually.be.rejectedWith(
        "At least one student in the attempted payment has already registered."
      );
    });

    it("savePayment - card type not accepted", async () => {
      const studentId = (await Person.create(randPerson())).id;
      const schoolYearId = 1;
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId,
        studentFeePayments: [
          {
            studentId,
            bookChargeInCents: 10000,
            registrationFeeInCents: 10000,
            tuitionInCents: 10000,
          },
        ],
      });
      await StudentStatusFlag.create({ studentId, schoolYearId: 2 });
      const paymentId = payment.id;
      const personId = 123;
      const obj = {
        number: "342826328808014",
        year: "2022",
        month: "2",
        cardCode: "123",
      };
      await expect(
        StudentService.savePayment(personId, paymentId, obj)
      ).to.eventually.be.rejectedWith(
        "american-express is not accepted by Chinese School"
      );
    });

    it("savePayment - Expiration Date", async () => {
      const studentId = (await Person.create(randPerson())).id;
      const schoolYearId = 1;
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId,
        studentFeePayments: [
          {
            studentId,
            bookChargeInCents: 10000,
            registrationFeeInCents: 10000,
            tuitionInCents: 10000,
          },
        ],
      });
      await StudentStatusFlag.create({ studentId, schoolYearId: 2 });
      const paymentId = payment.id;
      const personId = 123;
      const obj = {
        number: "4532928211171666",
        year: "2022",
        month: "13",
        cardCode: "123",
      };
      await expect(
        StudentService.savePayment(personId, paymentId, obj)
      ).to.eventually.be.rejectedWith("Expiration Date");
    });

    it("createStudentClassAssignments", async () => {
      const studentId = (await Person.create(randPerson())).id;
      const grade = await Grade.create({ englishName: randString() });
      const sc = createRandSchoolClass();
      sc.gradeId = grade.id;
      const schoolClass = await SchoolClass.create(sc);
      const schoolYear = await SchoolYear.create(createRandSchoolYear());
      const s = await SchoolClassActiveFlag.create();
      s.setSchoolClass(schoolClass.id);
      s.setSchoolYear(schoolYear.id);
      await s.save();

      const schoolYearId = schoolYear.id;
      await RegistrationPreference.create({
        schoolYearId,
        studentId,
        entered_by_id: studentId,
        schoolClassType: schoolClass.schoolClassType,
        grade_id: grade.id,
      });
      const payment = await RegistrationPayment.createWith({
        grandTotalInCents: 100000,
        cccaDueInCents: 1000,
        pvaDueInCents: 1000,
        paid_by_id: 1,
        schoolYearId,
        studentFeePayments: [
          {
            studentId,
            bookChargeInCents: 10000,
            registrationFeeInCents: 10000,
            tuitionInCents: 10000,
          },
        ],
      });
      expect(payment.paid).to.be.false;
      const paymentId = payment.id;
      const personId = 123;
      const obj = {
        number: "4532928211171666",
        year: "2022",
        month: "11",
        cardCode: "123",
      };
      const student = await Person.getById(studentId);
      let studentStatusFlag = await student.studentStatusFlagFor(schoolYearId);
      expect(studentStatusFlag).to.be.null;

      const rtn = await StudentService.savePayment(personId, paymentId, obj);
      expect(rtn.registrationPayment.paid).to.be.true;
      expect(rtn.registrationPayment.schoolYearId).to.eq(schoolYearId);
      studentStatusFlag = await student.studentStatusFlagFor(schoolYearId);
      expect(studentStatusFlag).to.be.not.null;
      expect(studentStatusFlag.studentId).to.eq(studentId);
      expect(studentStatusFlag.schoolYearId).to.eq(schoolYearId);
      expect(studentStatusFlag.registered).to.be.true;
    });
  });
});
