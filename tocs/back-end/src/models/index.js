import Sequelize from "sequelize";
import config from "config";
import { sqlLogger } from "../utils/logger";

// Models
import address from "./address.model";
import bookCharge from "./book-charge.model";
import family from "./family.model";
import gatewayTransaction from "./gateway-transaction.model";
import grade from "./grade.model";
import inPersonRegistrationTransaction from "./in-person-registration-transaction.model";
import instructorAssignment from "./instructor-assignment.model";
import libraryBook from "./library-book.model";
import libraryBookCheckout from "./library-book-checkout.model";
import manualTransaction from "./manual-transaction.model";
import person from "./person.model";
import registrationPayment from "./registration-payment.model";
import registrationPreference from "./registration-preference.model";
import right from "./right.model";
import role from "./role.model";
import schoolClass from "./school-class.model";
import schoolClassActiveFlag from "./school-class-active-flag.model";
import schoolYear from "./school-year.model";
import staffAssignment from "./staff-assignment.model";
import studentClassAssignment from "./student-class-assignment.model";
import studentFeePayment from "./student-fee-payment.model";
import studentStatusFlag from "./student-status-flag.model";
import user from "./user.model";
import withdrawalRecord from "./withdrawal-record.model";
import withdrawRequest from "./withdraw-request.model";
import withdrawRequestDetail from "./withdraw-request-detail.model";

const dbConfig = config.get("dbConfig");

const { database, username, password, host, port, dialect } = dbConfig;

const { max, min, acquire, idle } = dbConfig.pool;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  pool: {
    max,
    min,
    acquire,
    idle,
  },
  define: { underscored: true },
  logging: (msg) => sqlLogger.info(msg),
});

const db = { Sequelize, sequelize };

/* Common functions */
const createFindFirstByFn = (model) => async (obj) =>
  model.findOne({ where: obj });
const createGetByIdFn = (model) => async (id) =>
  createFindFirstByFn(model)({ id });
const createDeleteByIdFn = (model) => async (id) =>
  model.destroy({ where: { id } });

/*
 * withStrings: [[fieldName, columnName], 'fieldName', ...]
 */
const fieldsFactory = ({
  withId,
  withStrings,
  withIntegers,
  withDates,
  withBooleans,
} = {}) => {
  const fields = {};
  fields.id =
    (withId && {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }) ||
    undefined;

  [
    [withStrings, Sequelize.STRING],
    [withIntegers, Sequelize.INTEGER],
    [withDates, Sequelize.DATE],
    [withBooleans, Sequelize.BOOLEAN],
  ].forEach(([collection, sequelizeType]) => {
    collection &&
      collection
        .map((obj) => (Array.isArray(obj) && obj) || [obj, obj.toLowerCase()])
        .forEach(([field, column, presence] = {}) =>
          Object.assign(fields, {
            [field]: {
              type: sequelizeType,
              field: column,
              allowNull: !presence,
            },
          })
        );
  });
  return fields;
};

/* Mapping */
const mappings = [
  ["Address", address],
  ["BookCharge", bookCharge],
  ["ElectiveClass", schoolClass],
  ["Family", family],
  ["GatewayTransaction", gatewayTransaction],
  ["Grade", grade],
  ["InPersonRegistrationTransaction", inPersonRegistrationTransaction],
  ["Instructor", person],
  ["InstructorAssignment", instructorAssignment],
  ["LibraryBook", libraryBook],
  ["LibraryBookCheckOut", libraryBookCheckout],
  ["LibraryBookCheckedOutBy", person],
  ["ManualTransaction", manualTransaction],
  ["Person", person],
  ["PreviousGrade", grade],
  ["NextGrade", grade],
  ["RegistrationPayment", registrationPayment],
  ["RegistrationPreference", registrationPreference],
  ["Right", right],
  ["Role", role],
  ["SchoolClass", schoolClass],
  ["SchoolClassActiveFlag", schoolClassActiveFlag],
  ["SchoolYear", schoolYear],
  ["StaffAssignment", staffAssignment],
  ["StudentClassAssignment", studentClassAssignment],
  ["StudentFeePayment", studentFeePayment],
  ["StudentStatusFlag", studentStatusFlag],
  ["User", user],
  ["WithdrawalRecord", withdrawalRecord],
  ["WithdrawRequest", withdrawRequest],
  ["WithdrawRequestDetail", withdrawRequestDetail],
  ["Children", person],
  ["EnteredBy", person],
  ["PaidBy", person],
  ["ParentOne", person],
  ["ParentTwo", person],
  ["RecordedBy", person],
  ["Student", person],
  ["TransactionBy", person],
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
  Address,
  BookCharge,
  ElectiveClass,
  Family,
  GatewayTransaction,
  Grade,
  InPersonRegistrationTransaction,
  InstructorAssignment,
  LibraryBook,
  LibraryBookCheckOut,
  LibraryBookCheckedOutBy,
  ManualTransaction,
  NextGrade,
  Person,
  PreviousGrade,
  RegistrationPayment,
  RegistrationPreference,
  Right,
  Role,
  SchoolClass,
  SchoolClassActiveFlag,
  SchoolYear,
  StaffAssignment,
  StudentClassAssignment,
  StudentFeePayment,
  StudentStatusFlag,
  User,
  WithdrawalRecord,
  WithdrawRequest,
  WithdrawRequestDetail,
  Children,
  EnteredBy,
  Instructor,
  PaidBy,
  ParentOne,
  ParentTwo,
  RecordedBy,
  Student,
  TransactionBy,
} = db;

Object.assign(Address, {
  Family: Address.hasOne(Family),
  Person: Address.hasOne(Person),
});

Object.assign(BookCharge, {
  Grade: BookCharge.belongsTo(Grade, {
    foreignKey: { allowNull: false },
    as: "grade",
  }),
  SchoolYear: BookCharge.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
});

Object.assign(Family, {
  Address: Family.belongsTo(Address, { foreignKey: { allowNull: false } }),
  ParentOne: Family.belongsTo(ParentOne, {
    foreignKey: "parent_one_id",
    as: "parentOne",
  }),
  ParentTwo: Family.belongsTo(ParentTwo, {
    foreignKey: "parent_two_id",
    as: "parentTwo",
  }),
  Children: Family.belongsToMany(Children, {
    through: "families_children",
    foreignKey: "family_id",
    otherKey: "child_id",
    as: "children",
  }),
});

Object.assign(GatewayTransaction, {
  RegistrationPayment: GatewayTransaction.belongsTo(RegistrationPayment, {
    as: "registrationPayment",
  }),
});

Object.assign(Grade, {
  NextGrade: Grade.belongsTo(NextGrade, {
    foreignKey: "next_grade",
    as: "nextGrade",
  }),
  PreviousGrade: Grade.hasOne(PreviousGrade, {
    foreignKey: "next_grade",
    as: "previousGrade",
  }),
});

Object.assign(InPersonRegistrationTransaction, {
  RegistrationPayment: InPersonRegistrationTransaction.belongsTo(
    RegistrationPayment,
    { foreignKey: { allowNull: false }, as: "registrationPayment" }
  ),
  RecordedBy: InPersonRegistrationTransaction.belongsTo(RecordedBy, {
    foreignKey: { name: "recorded_by_id", allowNull: false },
    as: "recordedBy",
  }),
});

Object.assign(Instructor, {
  Address: Instructor.belongsTo(Address),
});

Object.assign(InstructorAssignment, {
  Instructor: InstructorAssignment.belongsTo(Person, {
    foreignKey: { allowNull: false },
    as: "instructor",
  }),
  SchoolClass: InstructorAssignment.belongsTo(SchoolClass, {
    foreignKey: { allowNull: false },
    as: "schoolClass",
  }),
  SchoolYear: InstructorAssignment.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
});

Object.assign(LibraryBook, {
  LibraryBookCheckOut: LibraryBook.hasMany(LibraryBookCheckOut, {
    as: "checkOuts",
  }),
});

Object.assign(LibraryBookCheckOut, {
  LibraryBook: LibraryBookCheckOut.belongsTo(LibraryBook, {
    foreignKey: "library_book_id",
    as: "libraryBook",
  }),
  LibraryBookCheckedOutBy: LibraryBookCheckOut.belongsTo(
    LibraryBookCheckedOutBy,
    { foreignKey: "checked_out_by_id", as: "checkedOutBy" }
  ),
});

Object.assign(ManualTransaction, {
  TransactionBy: ManualTransaction.belongsTo(TransactionBy, {
    foreignKey: { name: "transaction_by_id", allowNull: false },
    as: "transactionBy",
  }),
  RecordedBy: ManualTransaction.belongsTo(RecordedBy, {
    foreignKey: { name: "recorded_by_id", allowNull: false },
    as: "recordedBy",
  }),
  Student: ManualTransaction.belongsTo(Student, {
    foreignKey: { allowNull: false },
    as: "student",
  }),
});

Object.assign(Person, {
  User: Person.hasOne(User),
  Address: Person.belongsTo(Address),
  RegistrationPreference: Person.hasMany(RegistrationPreference, {
    foreignKey: "student_id",
    as: "registrationPreferences",
  }),
  StudentClassAssignment: Person.hasMany(StudentClassAssignment, {
    foreignKey: "student_id",
    as: "studentClassAssignments",
  }),
  InstructorAssignment: Person.hasMany(InstructorAssignment, {
    foreignKey: "instructor_id",
    as: "instructorAssignments",
  }),
  StaffAssignment: Person.hasMany(StaffAssignment, {
    foreignKey: "person_id",
    as: "staffAssignments",
  }),
  StudentStatusFlag: Person.hasMany(StudentStatusFlag, {
    foreignKey: "student_id",
    as: "studentStatusFlags",
  }),
});

Object.assign(RegistrationPayment, {
  SchoolYear: RegistrationPayment.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
  PaidBy: RegistrationPayment.belongsTo(PaidBy, {
    foreignKey: { name: "paid_by_id", allowNull: false },
    as: "paidBy",
  }),
  GatewayTransaction: RegistrationPayment.hasMany(GatewayTransaction, {
    as: "gatewayTransactions",
  }),
  StudentFeePayment: RegistrationPayment.hasMany(StudentFeePayment, {
    as: "studentFeePayments",
  }),
  InPersonRegistrationTransaction: RegistrationPayment.hasOne(
    InPersonRegistrationTransaction
  ),
});

Object.assign(RegistrationPreference, {
  SchoolYear: RegistrationPreference.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
  Student: RegistrationPreference.belongsTo(Student, {
    foreignKey: { name: "student_id", allowNull: false },
    as: "student",
  }),
  EnteredBy: RegistrationPreference.belongsTo(EnteredBy, {
    foreignKey: { name: "entered_by_id", allowNull: false },
    as: "enteredBy",
  }),
  PreviousGrade: RegistrationPreference.belongsTo(PreviousGrade, {
    foreignKey: "previous_grade_id",
    as: "previousGrade",
  }),
  Grade: RegistrationPreference.belongsTo(Grade, {
    foreignKey: { name: "grade_id", allowNull: false },
    as: "grade",
  }),
  ElectiveClass: RegistrationPreference.belongsTo(ElectiveClass, {
    foreignKey: "elective_class_id",
    as: "electiveClass",
  }),
});

Object.assign(Right, {
  Role: Right.belongsToMany(Role, {
    through: "rights_roles",
    foreignKey: "right_id",
    otherKey: "role_id",
  }),
});

Object.assign(Role, {
  Right: Role.belongsToMany(Right, {
    through: "rights_roles",
    foreignKey: "role_id",
    otherKey: "right_id",
    as: "rights",
  }),
  User: Role.belongsToMany(User, {
    through: "roles_users",
    foreignKey: "role_id",
    otherKey: "user_id",
  }),
});

Object.assign(SchoolClass, {
  Grade: SchoolClass.belongsTo(Grade, { as: "grade" }),
  SchoolClassActiveFlag: SchoolClass.hasMany(SchoolClassActiveFlag, {
    as: "schoolClassActiveFlags",
  }),
});

Object.assign(SchoolClassActiveFlag, {
  SchoolClass: SchoolClassActiveFlag.belongsTo(SchoolClass, {
    as: "schoolClass",
  }),
  SchoolYear: SchoolClassActiveFlag.belongsTo(SchoolYear, { as: "schoolYear" }),
});

Object.assign(SchoolYear, {
  PreviousSchoolYear: SchoolYear.belongsTo(SchoolYear, {
    as: "previousSchoolYear",
  }),
});

Object.assign(StaffAssignment, {
  Person: StaffAssignment.belongsTo(Person),
  SchoolYear: StaffAssignment.belongsTo(SchoolYear),
});

Object.assign(Student, {
  StudentClassAssignment: Student.hasMany(StudentClassAssignment, {
    foreignKey: "student_id",
    as: "studentClassAssignments",
  }),
  StudentStatusFlag: Student.hasMany(StudentStatusFlag, {
    foreignKey: "student_id",
    as: "studentStatusFlags",
  }),
});

Object.assign(StudentClassAssignment, {
  Student: StudentClassAssignment.belongsTo(Student, {
    foreignKey: { allowNull: false },
    as: "student",
  }),
  Grade: StudentClassAssignment.belongsTo(Grade, {
    foreignKey: { allowNull: false },
    as: "grade",
  }),
  SchoolClass: StudentClassAssignment.belongsTo(SchoolClass, {
    as: "schoolClass",
  }),
  SchoolYear: StudentClassAssignment.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
  ElectiveClass: StudentClassAssignment.belongsTo(SchoolClass, {
    foreignKey: { name: "elective_class_id" },
    as: "electiveClass",
  }),
});

Object.assign(StudentFeePayment, {
  Student: StudentFeePayment.belongsTo(Student, {
    foreignKey: { allowNull: false },
    as: "student",
  }),
  RegistrationPayment: StudentFeePayment.belongsTo(RegistrationPayment, {
    as: "registrationPayment",
  }),
});

Object.assign(StudentStatusFlag, {
  Student: StudentStatusFlag.belongsTo(Student, {
    foreignKey: { allowNull: false },
    as: "student",
  }),
  SchoolYear: StudentStatusFlag.belongsTo(SchoolYear, {
    foreignKey: { allowNull: false },
    as: "schoolYear",
  }),
});

Object.assign(User, {
  Role: User.belongsToMany(Role, {
    through: "roles_users",
    foreignKey: "user_id",
    otherKey: "role_id",
  }),
  Person: User.belongsTo(Person, { foreignKey: { allowNull: false } }),
  PersonAddress: Person.Address,
});

Object.assign(WithdrawalRecord, {
  Student: WithdrawalRecord.belongsTo(Student, { as: "student" }),
  Grade: WithdrawalRecord.belongsTo(Grade),
  SchoolClass: WithdrawalRecord.belongsTo(SchoolClass),
  SchoolYear: WithdrawalRecord.belongsTo(SchoolYear),
  ElectiveClass: WithdrawalRecord.belongsTo(SchoolClass, {
    foreignKey: { name: "elective_class_id" },
    as: "electiveClass",
  }),
});

Object.assign(WithdrawRequest, {
  RequestBy: WithdrawRequest.belongsTo(Person, {
    foreignKey: { name: "request_by_id" },
    as: "requestBy",
  }),
  statusBy: WithdrawRequest.belongsTo(Person, {
    foreignKey: { name: "status_by_id" },
    as: "statusBy",
  }),
  SchoolYear: WithdrawRequest.belongsTo(SchoolYear, { as: "schoolYear" }),
  WithdrawRequestDetails: WithdrawRequest.hasMany(WithdrawRequestDetail, {
    as: "withdrawRequestDetails",
  }),
});

Object.assign(WithdrawRequestDetail, {
  WithdrawRequest: WithdrawRequestDetail.belongsTo(WithdrawRequest),
  Student: WithdrawRequestDetail.belongsTo(Student, { as: "student" }),
});

export default db;
