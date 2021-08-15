export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true, withBooleans: [['cccaLifetimeMember', 'ccca_lifetime_member']] });
  const Family = sequelize.define('family', fields);
  const getFamilyIdsByPersonIdSql = (personId) => 'SELECT id AS family_id FROM families WHERE'
  + ` parent_one_id=${personId} OR parent_two_id=${personId}`
  + ` UNION SELECT family_id FROM families_children WHERE child_id=${personId}`;
  /* Prototype */
  Object.assign(Family.prototype, {
    async childrenNames() {
      const children = await this.getChildren();
      return children.map((child) => child.name());
    },
    async isParentOne(person) {
      const p = await this.getParentOne();
      return !!(p && person && p.id === person.id);
    },
    async isParentTwo(person) {
      const p = await this.getParentTwo();
      return !!(p && person && p.id === person.id);
    },
    /* TODO Not yet implemented
      def has_staff_for?(school_year)
      def has_instructor_for?(school_year)
    */
  });

  /* Non-prototype */
  Object.assign(Family, {
    createWith: async (obj) => Family.create(obj,
      {
        include: [
          { association: Family.ParentOne },
          { association: Family.ParentTwo },
          { association: Family.Address }],
      }),
    async getFamilyMemberIds(personId) {
      let sql = 'SELECT DISTINCT person_id FROM(';
      sql += 'SELECT id AS family_id, parent_one_id AS person_id FROM families';
      sql += ' UNION SELECT id AS family_id, parent_two_id AS person_id FROM families';
      sql += ' UNION SELECT family_id, child_id AS person_id FROM families_children';
      sql += `)t1,(${getFamilyIdsByPersonIdSql(personId)})t2`;
      sql += ' WHERE t1.family_id=t2.family_id AND person_id IS NOT NULL';
      const [result] = await sequelize.query(sql);
      return result.map((r) => r.person_id);
    },
    async memberStaffInstructorInfo(personId, schoolYearId) {
      const memberIds = await Family.getFamilyMemberIds(personId);
      let sql = 'SELECT * FROM (';
      sql += 'SELECT \'I\' AS type,school_year_id,instructor_id AS p_id FROM instructor_assignments';
      sql += ' UNION SELECT \'S\',school_year_id,person_id FROM staff_assignments)t';
      sql += ` WHERE school_year_id=${schoolYearId} AND p_id IN (${memberIds.join(',')})`;
      const [result] = await sequelize.query(sql);
      return result.reduce((r, c) => {
        if (c.type === 'S') {
          return Object.assign(r, { staff: true });
        }
        if (c.type === 'I') {
          return Object.assign(r, { instructor: true });
        }
        return r;
      }, { instructor: false, staff: false });
    },
    async familyCccaLifetimeMember(personId) {
      let sql = 'SELECT ccca_lifetime_member FROM families WHERE id IN';
      sql += `(${getFamilyIdsByPersonIdSql(personId)})`;
      const [result] = await sequelize.query(sql);
      return !!result[0].ccca_lifetime_member;
    },
  });

  return Family;
};
