import { Link } from 'react-router-dom';

const ManageBooks = () => <Link to='/librarian/books'>Manage Books</Link>;

const ViewLibraryBooks = () => <Link to='/librarian/books/read-only'>View Library Books</Link>;

const ListAllGrades = () => <Link to='/admin/grades'>List All Grades</Link>;

const ListAllSchoolClasses = () => <Link to='/admin/school-classes'>List All School Classes</Link>;

const ListActiveSchoolClasses = ({ schoolYear }) => <Link to={`/registration/active-school-classes?schoolYearId=${schoolYear.id}`}>{schoolYear.name} Active School Classes</Link>;

const ListAllPeople = () => <Link to='/registration/people'>List All People</Link>;

const ManageSchoolYears = () => <Link to='/admin/school-years'>Manage School Years</Link>;

const ManageStaffAssignments = () => <Link to='/admin/manage-staff-assignments'>Manage Staff Assignments</Link>;

const CreateANewFamily = () => <Link to='/new-family-form'>Create A New Family</Link>;

const ListInstructorDiscountInformation = () => <Link to='/accounting/instructor-discount'>List Instructor Discount Information</Link>;

const ListAvtiveSchoolClassGradeCount = ({ schoolYear }) => <Link to={`/registration/active_school_classes/grade_student_count?schoolYearId=${schoolYear.id}`}>{schoolYear.name} 年級人數清單</Link>

const ListSiblingInSameGradeReport = ({ schoolYear }) => <Link to={`/registration/sibling-in-same-grade?schoolYearId=${schoolYear.id}`}>Sibling in Same Grade Report</Link>

export {
    ListAllGrades, ListAllSchoolClasses, ManageBooks, ManageSchoolYears, ManageStaffAssignments, ViewLibraryBooks,
    CreateANewFamily, ListAllPeople, ListInstructorDiscountInformation, ListActiveSchoolClasses,
    ListAvtiveSchoolClassGradeCount, ListSiblingInSameGradeReport
};