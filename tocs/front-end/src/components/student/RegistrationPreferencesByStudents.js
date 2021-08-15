import Table from '../Table';
import { formatPersonNames, bilingualName } from '../../utils/utilities';

const RegistrationPreferencesByStudents = ({ schoolYear, registeredStudents }) => {
    const { previousSchoolYear } = schoolYear;
    const header = [
        { title: '', cell: (row) => formatPersonNames(row) },
        {
            title: (previousSchoolYear && `${previousSchoolYear.name} Grade`) || '',
            cell: (row) => row.registrationPreference.previousGrade ?
                bilingualName(row.registrationPreference.previousGrade)
                : 'Not In Record'
        },
        { title: `${schoolYear.name} Grade`, cell: (row) => bilingualName(row.registrationPreference.grade) },
        { title: 'Preferred School Class Type', cell: (row) => row.registrationPreference.schoolClassType },
        {
            title: 'Preferred Elective Class',
            cell: (row) => row.registrationPreference.electiveClass ?
                bilingualName(row.registrationPreference.electiveClass)
                : ''
        },
    ];

    return (registeredStudents && registeredStudents.length && (
        <>
            <Table header={header} items={registeredStudents} isLoaded="true" showAll="true" />
        </>
    )) || null;
};

export default RegistrationPreferencesByStudents;