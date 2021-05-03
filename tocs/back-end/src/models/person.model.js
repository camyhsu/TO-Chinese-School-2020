export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      ['chineseName', 'chinese_name'],
      ['nativeLanguage', 'native_language'],
    ],
  });

  const Person = sequelize.define('person', {
    ...fields,
    lastName: {
      type: Sequelize.STRING,
      field: 'english_last_name',
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'english_first_name',
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    gender: {
      type: Sequelize.STRING,
      field: 'gender',
      allowNull: false,
      validate: { notNull: true, notEmpty: true },
    },
    birthYear: {
      type: Sequelize.INTEGER,
      field: 'birth_year',
      validate: { max: new Date().getFullYear(), min: 1900 },
    },
    birthMonth: {
      type: Sequelize.INTEGER,
      field: 'birth_month',
      validate: { max: 12, min: 1 },
    },
    newChild: Sequelize.VIRTUAL,
  }, {
    hooks: {
      beforeValidate: (obj) => {
        ['birthYear', 'birthMonth']
          .reduce((r, current) => Object.assign(r, { [current]: r[current] || null }), obj);
        if (!obj.nativeLanguage) {
          Object.assign(obj, { nativeLanguage: Person.prototype.nativeLanguages[0] });
        }
      },
    },
  });

  /* Prototype */
  Object.assign(Person.prototype, {
    genders: { GENDER_MALE: 'M', GENDER_FEMALE: 'F' },
    nativeLanguages: ['Mandarin', 'English', 'Cantonese', 'Other'],
    name() {
      return `${this.chineseName}(${Person.prototype.englishName.call(this)})`;
    },
    englishName() {
      return `${this.firstName} ${this.lastName}`;
    },
    birthInfo() {
      return (this.birthYear && this.birthMonth && `${this.birthMonth}/${this.birthYear}`) || '';
    },
    async findFamiliesAsParent() {
      const fs = await sequelize.models.Family.findAll({
        where: { [Sequelize.Op.or]: [{ parent_one_id: this.id }, { parent_two_id: this.id }] },
      });
      return fs;
    },
    async findFamiliesAsChild() {
      const fs = await sequelize.models.Family.findAll({
        include: [{
          model: sequelize.models.Children,
          as: 'children',
          where: { id: this.id },
        }],
      });
      return fs;
    },
    async families() {
      const asParent = await this.findFamiliesAsParent();
      const asChild = await this.findFamiliesAsChild();
      return asParent.concat(asChild);
    },
    async isAParentOf(childId) {
      const sql = `${'SELECT COUNT(*) FROM families,families_children WHERE '
      + '(families.parent_one_id='}${this.id} OR families.parent_two_id=${this.id}) AND `
      + `families.id=families_children.family_id AND families_children.child_id=${childId}`;

      const [result] = await sequelize.query(sql);
      return result[0].count > 0;
    },
    async findChildren() {
      const families = await this.findFamiliesAsParent();
      const fPromises = families.map(async (family) => family.getChildren());
      const childrenInFamilies = await Promise.all(fPromises);
      return childrenInFamilies.reduce((r, c) => r.concat(c), []);
    },
    /* TODO Not yet implemented
      def school_age_for(school_year)
      def age_in_range_for_track_event?(grade)
      def is_a_child?
      def is_a_parent_of?(child_id)
      def instructor_assignments_for(school_year)
      def is_an_instructor_for?(school_year)
      def staff_assignments_for(school_year)
      def is_a_staff_for?(school_year)
      def student_class_assignment_for(school_year)
      def registration_preference_for(school_year)
      def student_status_flag_for(school_year)
      def jersey_number_for(school_year)
      def find_parents
      def find_children
      def personal_address
      def personal_email_address
      def personal_home_phone
      def email_and_phone_number_correct?(email, phone_number)
      def phone_number_correct?(phone_number)
      def find_completed_registration_payments_as_students
      def find_paid_student_fee_payment_as_student_for(school_year)
      def find_manual_transactions_as_students
      def find_all_non_filler_track_event_signups_as_students(school_year=SchoolYear.current_school_year)
      def track_event_scores(school_year=SchoolYear.current_school_year)
      def self.find_people_on_record(english_first_name, english_last_name, email, phone_number)
      def create_student_class_assignment_based_on_registration_preference(school_year)
      def current_year_registration_date
      def create_jersey_number
      def create_parent_jersey_number
      def find_withdraw_request_detail_by_student_for(school_year)
    */
  });

  /* Non-prototype */
  Object.assign(Person, {
    baselineMonths: (year = 0, month = 0) => year * 12 + month,
    createWith: async (obj) => Person.create(obj, { include: [{ association: Person.Address }] }),
  });

  return Person;
};
