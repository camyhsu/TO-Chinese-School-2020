/* eslint-disable no-param-reassign */
import { today } from "../utils/utilities.js";

export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withIntegers: [
      ["registrationFeeInCents", "registration_fee_in_cents", true],
      ["tuitionInCents", "tuition_in_cents", true],
      ["bookChargeInCents", "book_charge_in_cents", true],
    ],
  });

  const StudentFeePayment = sequelize.define("student_fee_payment", {
    ...fields,
    earlyRegistration: {
      type: Sequelize.BOOLEAN,
      field: "early_registration",
      defaultValue: false,
    },
    multipleChildDiscount: {
      type: Sequelize.BOOLEAN,
      field: "multiple_child_discount",
      defaultValue: false,
      allowNull: false,
    },
    preKDiscount: {
      type: Sequelize.BOOLEAN,
      field: "pre_k_discount",
      defaultValue: false,
      allowNull: false,
    },
    prorate75: {
      type: Sequelize.BOOLEAN,
      field: "prorate_75",
      defaultValue: false,
      allowNull: false,
    },
    prorate50: {
      type: Sequelize.BOOLEAN,
      field: "prorate_50",
      defaultValue: false,
      allowNull: false,
    },
    instructorDiscount: {
      type: Sequelize.BOOLEAN,
      field: "instructor_discount",
      defaultValue: false,
      allowNull: false,
    },
    staffDiscount: {
      type: Sequelize.BOOLEAN,
      field: "staff_discount",
      defaultValue: false,
      allowNull: false,
    },
  });

  /* Prototype */
  Object.assign(StudentFeePayment.prototype, {});

  /* Non-prototype */
  Object.assign(StudentFeePayment, {
    async findPaidStudentFeePaymentAsStudentFor(studentId, schoolYearId) {
      return StudentFeePayment.findAll({
        where: { studentId },
        include: [
          {
            model: sequelize.models.RegistrationPayment,
            as: "registrationPayment",
            where: { schoolYearId, paid: true },
          },
        ],
      });
    },
    async fillInTuitionAndFee(
      obj,
      personId,
      schoolYear,
      grade,
      paidAndPendingStudentFeePayments
    ) {
      obj.registrationFeeInCents = schoolYear.registrationFeeInCents;
      const bookChargeInCents =
        await sequelize.models.BookCharge.bookChargeInCentsFor(
          schoolYear.id,
          grade.id
        );
      obj.bookChargeInCents = bookChargeInCents;
      await StudentFeePayment.calculateTuition(
        obj,
        personId,
        schoolYear,
        grade,
        paidAndPendingStudentFeePayments
      );
    },
    async calculateTuition(
      obj,
      personId,
      schoolYear,
      grade,
      paidAndPendingStudentFeePayments
    ) {
      if (today() <= schoolYear.earlyRegistrationEndDate) {
        obj.earlyRegistration = true;
        obj.tuitionInCents = schoolYear.earlyRegistrationTuitionInCents;
      } else {
        obj.tuitionInCents = schoolYear.tuitionInCents;
      }
      StudentFeePayment.applyPreKDiscount(obj, schoolYear, grade);
      StudentFeePayment.applyMultipleChildDiscount(
        obj,
        schoolYear,
        paidAndPendingStudentFeePayments
      );
      StudentFeePayment.applyLateRegistrationProrate(obj, schoolYear);
      await StudentFeePayment.applyStaffAndInstructorDiscount(
        obj,
        personId,
        schoolYear,
        paidAndPendingStudentFeePayments
      );
    },
    applyPreKDiscount(obj, schoolYear, grade) {
      if (grade.gradePreschool) {
        obj.preKDiscount = true;
        obj.tuitionInCents -= schoolYear.tuitionDiscountForPreKInCents;
      }
    },
    applyMultipleChildDiscount(
      obj,
      schoolYear,
      paidAndPendingStudentFeePayments
    ) {
      if (paidAndPendingStudentFeePayments.length >= 2) {
        obj.multipleChildDiscount = true;
        obj.tuitionInCents -=
          schoolYear.tuitionDiscountForThreeOrMoreChildInCents;
      }
    },
    applyLateRegistrationProrate(obj, schoolYear) {
      // As of 2017-2018 school year, registration_50_percent_date is no longer used
      if (today() > schoolYear.registration75PercentDate) {
        obj.prorate75 = true;
        obj.tuitionInCents *= 0.75;
      }
    },
    async applyStaffAndInstructorDiscount(
      obj,
      personId,
      schoolYear,
      paidAndPendingStudentFeePayments
    ) {
      const result = await sequelize.models.Family.memberStaffInstructorInfo(
        personId,
        schoolYear.id
      );
      if (
        result.staff &&
        !paidAndPendingStudentFeePayments.find((p) => p.staffDiscount)
      ) {
        // Only one tuition discount for staff
        obj.staffDiscount = true;
        obj.tuitionInCents = 0;
      } else if (result.instructor) {
        /*
         * If a family has both staff and instructor, only the staff discount applies
         * hence, we only need to check for instructor in the family if there is no staff in the family
         */
        const numberOfInstructorDiscountAlreadyApplied =
          paidAndPendingStudentFeePayments.filter(
            (p) => p.instructorDiscount
          ).length;
        if (numberOfInstructorDiscountAlreadyApplied < 2) {
          obj.instructorDiscount = true;
          obj.tuitionInCents -= schoolYear.tuitionDiscountForInstructorInCents;
        }
      }
    },
  });

  return StudentFeePayment;
};
