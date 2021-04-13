import Sequelize from 'sequelize';
import config from 'config';

// Models
import address from './address.model.js';
import family from './family.model.js';
import grade from './grade.model.js';
import libraryBook from './library-book.model.js';
import libraryBookCheckout from './library-book-checkout.model.js';
import person from './person.model.js';
import right from './right.model.js';
import role from './role.model.js';
import schoolYear from './school-year.model.js';
import staffAssignment from './staff-assignment.model.js';
import user from './user.model.js';

const dbConfig = config.get('dbConfig');

const {
  database, username, password, host, port, dialect,
} = dbConfig;

const {
  max, min, acquire, idle,
} = dbConfig.pool;

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    port,
    dialect,
    pool: {
      max, min, acquire, idle,
    },
    define: { underscored: true },
  },
);

const db = { Sequelize, sequelize };

/* Common functions */
const createFindFirstByFn = (model) => async (obj) => model.findOne({ where: obj });
const createGetByIdFn = (model) => async (id) => createFindFirstByFn(model)({ id });
const createDeleteByIdFn = (model) => async (id) => model.destroy({ where: { id } });

/*
 * withStrings: [[fieldName, columnName], 'fieldName', ...]
 */
const fieldsFactory = ({
  withId, withStrings, withIntegers, withDates,
} = {}) => {
  const fields = {};
  fields.id = (withId && {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }) || undefined;
  withStrings && withStrings.map((obj) => (Array.isArray(obj) && obj) || [obj, obj.toLowerCase()])
    .forEach(([field, column] = {}) => Object.assign(fields,
      { [field]: { type: Sequelize.STRING, field: column } }));
  withIntegers && withIntegers.map((obj) => (Array.isArray(obj) && obj) || [obj, obj.toLowerCase()])
    .forEach(([field, column] = {}) => Object.assign(fields,
      { [field]: { type: Sequelize.INTEGER, field: column } }));
  withDates && withDates.map((obj) => (Array.isArray(obj) && obj) || [obj, obj.toLowerCase()])
    .forEach(([field, column] = {}) => Object.assign(fields,
      { [field]: { type: Sequelize.DATE, field: column } }));
  return fields;
};

/* Mapping */
const mappings = [
  ['Address', address], ['Family', family], ['Grade', grade],
  ['LibraryBook', libraryBook], ['LibraryBookCheckOut', libraryBookCheckout], ['LibraryBookCheckedOutBy', person],
  ['Person', person], ['Right', right], ['Role', role], ['SchoolYear', schoolYear],
  ['StaffAssignment', staffAssignment], ['User', user],
  ['Children', person], ['ParentOne', person], ['ParentTwo', person],
];
mappings.forEach((mapping) => {
  db[mapping[0]] = mapping[1](sequelize, Sequelize, fieldsFactory);
  const model = db[mapping[0]];
  sequelize.models[mapping[0]] = model;
  Object.assign(model, {
    getById: createGetByIdFn(model),
    deleteById: createDeleteByIdFn(model),
    findFirstBy: createFindFirstByFn(model),
  });
});

/* Associations */
const {
  Address, Family, LibraryBook, LibraryBookCheckOut, LibraryBookCheckedOutBy,
  Person, Right, Role, SchoolYear, StaffAssignment, User,
  Children, ParentOne, ParentTwo,
} = db;

Object.assign(Address, {
  Family: Address.hasOne(Family),
  Person: Address.hasOne(Person),
});

Object.assign(Family, {
  Address: Family.belongsTo(Address, { foreignKey: { allowNull: false } }),
  ParentOne: Family.belongsTo(ParentOne, { foreignKey: 'parent_one_id', as: 'parentOne' }),
  ParentTwo: Family.belongsTo(ParentTwo, { foreignKey: 'parent_two_id', as: 'parentTwo' }),
  Children: Family.belongsToMany(Children,
    {
      through: 'families_children', foreignKey: 'family_id', otherKey: 'child_id', as: 'children',
    }),
});

Object.assign(LibraryBook, {
  LibraryBookCheckOut: LibraryBook.hasMany(LibraryBookCheckOut, { as: 'checkOuts' }),
});

Object.assign(LibraryBookCheckOut, {
  LibraryBook: LibraryBookCheckOut.belongsTo(LibraryBook,
    { foreignKey: 'library_book_id', as: 'libraryBook' }),
  LibraryBookCheckedOutBy: LibraryBookCheckOut.belongsTo(LibraryBookCheckedOutBy,
    { foreignKey: 'checked_out_by_id', as: 'checkedOutBy' }),
});

Object.assign(Person, {
  User: Person.hasOne(User),
  Address: Person.belongsTo(Address),
});

Object.assign(Right, {
  Role: Right.belongsToMany(Role, { through: 'rights_roles', foreignKey: 'right_id', otherKey: 'role_id' }),
});

Object.assign(Role, {
  Right: Role.belongsToMany(Right, { through: 'rights_roles', foreignKey: 'role_id', otherKey: 'right_id' }),
  User: Role.belongsToMany(User, { through: 'roles_users', foreignKey: 'role_id', otherKey: 'user_id' }),
});

Object.assign(StaffAssignment, {
  Person: StaffAssignment.belongsTo(Person),
  SchoolYear: StaffAssignment.belongsTo(SchoolYear),
});

Object.assign(User, {
  Role: User.belongsToMany(Role, { through: 'roles_users', foreignKey: 'user_id', otherKey: 'role_id' }),
  Person: User.belongsTo(Person, { foreignKey: { allowNull: false } }),
  PersonAddress: Person.Address,
});

export default db;
