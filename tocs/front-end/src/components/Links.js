import { Link } from "react-router-dom";
import dataService from "../services/data.service";

const ManageBooks = () => <Link to="/librarian/books">Manage Books</Link>;

const ViewLibraryBooks = () => (
  <Link to="/librarian/books/read-only">View Library Books</Link>
);

const ListAllGrades = () => <Link to="/admin/grades">List All Grades</Link>;

const ListAllSchoolClasses = () => (
  <Link to="/admin/school-classes">List All School Classes</Link>
);

const ListActiveSchoolClasses = ({ schoolYear } = {}) => {
  let url = "/instruction/active-school-classes";
  let prefix = "List";
  if (schoolYear) {
    url = `/registration/active-school-classes/${schoolYear.id}`;
    prefix = schoolYear.name;
  }
  return <Link to={url}>{prefix} Active School Classes</Link>;
};

const ListAllPeople = () => (
  <Link to="/registration/people">List All People</Link>
);

const ManageSchoolYears = () => (
  <Link to="/admin/school-years">Manage School Years</Link>
);

const ManageStaffAssignments = () => (
  <Link to="/admin/manage-staff-assignments">Manage Staff Assignments</Link>
);

const CreateANewFamily = () => (
  <Link to="/new-family-form">Create A New Family</Link>
);

const ListInstructorDiscountInformation = () => (
  <Link to="/accounting/instructor-discount">
    List Instructor Discount Information
  </Link>
);

const ListGradeStudentCount = ({ schoolYear }) => (
  <Link
    to={`/registration/school-classes/grade-student-count/${schoolYear.id}`}
  >
    {schoolYear.name} 年級人數清單
  </Link>
);

const ListGradeClassStudentCount = ({ schoolYear }) => (
  <Link
    to={`/registration/school-classes/student-count/grade/${schoolYear.id}`}
  >
    {schoolYear.name} 班級人數清單
  </Link>
);

const ListElectiveClassStudentCount = ({ schoolYear }) => (
  <Link
    to={`/registration/school-classes/student-count/elective/${schoolYear.id}`}
  >
    {schoolYear.name} Elective Class 人數清單
  </Link>
);

const ListSiblingInSameGradeReport = ({ schoolYear }) => (
  <Link to={`/registration/sibling-in-same-grade/${schoolYear.id}`}>
    Sibling in Same Grade Report
  </Link>
);

const ChargesCollected = ({ schoolYear }) => (
  <Link
    to={`/accounting/charges-collected/${schoolYear.id}/${schoolYear.name}`}
  >
    {schoolYear.name} Tuition and Fee Collected
  </Link>
);

const CSV = ({ path, text }) => <a href={dataService.csv(path)}>{text}</a>;

const DailyRegistrationSummary = ({ schoolYear }) => (
  <Link
    to={`/accounting/daily-registration-summary/${schoolYear.id}/${schoolYear.name}`}
  >
    {schoolYear.name} Daily Online Registration Summary
  </Link>
);

const ProcessInPersonRegistrationPayments = () => (
  <Link to="/accounting/in-person-registration-payments">
    Process In-person Registration Payments
  </Link>
);

const ListActiveStudentsByName = () => (
  <Link to="/registration/student-class-assignments">
    List Active Students By Name
  </Link>
);

const SearchStudentsByRegistrationDates = () => (
  <Link to="/librarian/search-students">
    Search Students By Registration Dates
  </Link>
);

const ListWithdrawRequests = () => (
  <Link to="/admin/withdraw-requests">List Withdraw Requests</Link>
);

export {
  ListAllGrades,
  ListAllSchoolClasses,
  ManageBooks,
  ManageSchoolYears,
  ManageStaffAssignments,
  ViewLibraryBooks,
  CreateANewFamily,
  ListAllPeople,
  ListInstructorDiscountInformation,
  ListActiveSchoolClasses,
  ListElectiveClassStudentCount,
  ListGradeStudentCount,
  ListGradeClassStudentCount,
  ListSiblingInSameGradeReport,
  ChargesCollected,
  CSV,
  DailyRegistrationSummary,
  ProcessInPersonRegistrationPayments,
  ListActiveStudentsByName,
  SearchStudentsByRegistrationDates,
  ListWithdrawRequests,
};
