import { today } from '../utils/utilities.js';

export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: ['description'],
    withDates: [['startDate', 'start_date', true], ['endDate', 'end_date', true]],
  });
  const SchoolYear = sequelize.define('school_year', {
    ...fields,
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    registrationStartDate: { type: Sequelize.DATE, field: 'registration_start_date', allowNull: false },
    registration75PercentDate: { type: Sequelize.DATE, field: 'registration_75_percent_date', allowNull: false },
    registrationEndDate: { type: Sequelize.DATE, field: 'registration_end_date', allowNull: false },

    refund50PercentDate: { type: Sequelize.DATE, field: 'refund_50_percent_date', allowNull: false },
    refund90PercentDate: { type: Sequelize.DATE, field: 'refund_90_percent_date' },
    refundEndDate: { type: Sequelize.DATE, field: 'refund_end_date', allowNull: false },

    earlyRegistrationStartDate: { type: Sequelize.DATE, field: 'early_registration_start_date', allowNull: false },
    earlyRegistrationEndDate: { type: Sequelize.DATE, field: 'early_registration_end_date', allowNull: false },

    ageCutoffMonth: { type: Sequelize.INTEGER, field: 'age_cutoff_month', allowNull: false },

    registrationFeeInCents: {
      type: Sequelize.INTEGER,
      field: 'registration_fee_in_cents',
      allowNull: false,
      defaultValue: 2000,
      validate: { min: 1 },
    },
    tuitionInCents: {
      type: Sequelize.INTEGER,
      field: 'tuition_in_cents',
      allowNull: false,
      defaultValue: 38000,
      validate: { min: 1 },
    },
    pvaMembershipDueInCents: {
      type: Sequelize.INTEGER,
      field: 'pva_membership_due_in_cents',
      allowNull: false,
      defaultValue: 1500,
      validate: { min: 1 },
    },
    cccaMembershipDueInCents: {
      type: Sequelize.INTEGER,
      field: 'ccca_membership_due_in_cents',
      allowNull: false,
      defaultValue: 2000,
      validate: { min: 1 },
    },
    earlyRegistrationTuitionInCents: {
      type: Sequelize.INTEGER,
      field: 'early_registration_tuition_in_cents',
      allowNull: false,
      defaultValue: 38000,
      validate: { min: 1 },
    },
    tuitionDiscountForThreeOrMoreChildInCents: {
      type: Sequelize.INTEGER,
      field: 'tuition_discount_for_three_or_more_child_in_cents',
      allowNull: false,
      defaultValue: 3800,
      validate: { min: 1 },
    },
    tuitionDiscountForPreKInCents: {
      type: Sequelize.INTEGER,
      field: 'tuition_discount_for_pre_k_in_cents',
      allowNull: false,
      defaultValue: 4000,
      validate: { min: 0 },
    },
    tuitionDiscountForInstructorInCents: {
      type: Sequelize.INTEGER,
      field: 'tuition_discount_for_instructor_in_cents',
      allowNull: false,
      defaultValue: 4000,
      validate: { min: 0 },
    },
    autoClassAssignment: {
      type: Sequelize.BOOLEAN, field: 'auto_class_assignment', allowNull: false, defaultValue: false,
    },
  }, {
    validate: {
      startEndDateOrder() {
        if (!this.startDate || !this.endDate || this.startDate > this.endDate) {
          throw new Error(`${this.startDate} cannot be later than ${this.endDate}`);
        }
      },
    },
  });

  /* Prototype */
  Object.assign(SchoolYear.prototype, {

  });

  /* Non-prototype */
  Object.assign(SchoolYear, {
    async findCurrentAndFutureSchoolYears() {
      return SchoolYear.findAll({
        where: { endDate: { [Sequelize.Op.gte]: today() } },
        include: [{ model: SchoolYear, as: 'previousSchoolYear' }],
        order: [['startDate', 'ASC']],
      });
    },
    async currentSchoolYear() {
      const r = await SchoolYear.findCurrentAndFutureSchoolYears();
      return r[0];
    },
    async nextSchoolYear() {
      const r = await SchoolYear.findCurrentAndFutureSchoolYears();
      return r[1];
    },
  });

  return SchoolYear;
};
