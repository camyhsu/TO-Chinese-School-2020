import { Link } from 'react-router-dom';

const ManageBooks = () => <Link to={'/librarian/books'}>Manage Books</Link>;

const ViewLibraryBooks = () => <Link to={{
    pathname: '/librarian/books',
    params: {
        readOnly: true
    }
}}>View Library Books</Link>;

const ListAllGrades = () => <Link to={'/admin/grades'}>List All Grades</Link>;

const ListAllSchoolClasses = () => <Link to={'/admin/school-classes'}>List All School Classes</Link>;

const ManageSchoolYears = () => <Link to={'/admin/school-years'}>Manage School Years</Link>;

const ManageStaffAssignments = () => <Link to={'/admin/manage-staff-assignments'}>Manage Staff Assignments</Link>;

export { ListAllGrades, ListAllSchoolClasses, ManageBooks, ManageSchoolYears, ManageStaffAssignments, ViewLibraryBooks };