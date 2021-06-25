import Table from '../Table';

const RegistrationPreferencesByStudents = ({ schoolYear, registeredStudents }) => {
    const { previousSchoolYear } = schoolYear;
    const header = [
        { title: '', cell: (row) => row.name },
        { title: (previousSchoolYear && `${previousSchoolYear.name} Grade`) || '', prop: '' },
        { title: `${schoolYear.name} Grade`, prop: '' },
        { title: 'Preferred School Class Type', prop: '' },
        { title: 'Preferred Elective Class', prop: '' },
      ];

    return (registeredStudents && registeredStudents.length && (
        <>
        <Table header={header} items={registeredStudents} isLoaded="true" showAll="true" />
        </>
    )) || null;
};

export default RegistrationPreferencesByStudents;