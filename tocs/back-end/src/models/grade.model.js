export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      ['chineseName', 'chinese_name'],
      ['englishName', 'english_name'],
      ['shortName', 'short_name'],
      ['jerseyNumberPrefix', 'jersey_number_prefix'],
    ],
  });
  const Grade = sequelize.define('grade', {
    ...fields,
    nextGrade: {
      type: Sequelize.INTEGER,
      field: 'next_grade',
      allowNull: true,
    },
  });

  /* Prototype */
  Object.assign(Grade.prototype, {
    name() {
      return `${this.chineseName}(${this.englishName})`;
    },
  });

  /* Non-prototype */
  Object.assign(Grade, {

  });

  return Grade;
};
