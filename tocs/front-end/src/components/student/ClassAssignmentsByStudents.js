import Table from '../Table';

const ClassAssignmentsByStudents = ({ schoolYear, registeredStudents }) => {
    const header = [
        { title: '', cell: (row) => row.name },
        { title: `${schoolYear.name} Grade`, prop: '' },
        { title: 'School Class', prop: '' },
        { title: 'Elective Class', prop: '' },
      ];

    return (registeredStudents && registeredStudents.length && (
        <>
        <Table header={header} items={registeredStudents} isLoaded="true" showAll="true" />
        </>
    )) || null;
};

export default ClassAssignmentsByStudents;