import Table from "../Table";
import { formatPersonNames, bilingualName } from "../../utils/utilities";

const ClassAssignmentsByStudents = ({ schoolYear, registeredStudents }) => {
  const header = [
    { title: "", cell: (row) => formatPersonNames(row) },
    {
      title: `${schoolYear.name} Grade`,
      cell: (row) => bilingualName(row.registrationPreference.grade),
    },
    {
      title: "Preferred School Class Type",
      cell: (row) => row.registrationPreference.schoolClassType,
    },
    {
      title: "Preferred Elective Class",
      cell: (row) =>
        row.registrationPreference.electiveClass
          ? bilingualName(row.registrationPreference.electiveClass)
          : "",
    },
  ];

  return (
    (registeredStudents && registeredStudents.length && (
      <>
        <Table
          header={header}
          items={registeredStudents}
          isLoaded="true"
          showAll="true"
        />
      </>
    )) ||
    null
  );
};

export default ClassAssignmentsByStudents;
