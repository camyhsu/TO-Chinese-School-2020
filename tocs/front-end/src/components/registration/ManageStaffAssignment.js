import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "../Table";
import RegistrationService from "../../services/registration.service";
import { formatPersonNames } from "../../utils/utilities";
import { Card, CardBody, CardTitle } from "../Cards";

const ManageStaffAssignment = () => {
  const { schoolYearId } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });
  const header = [
    {
      title: "Name",
      cell: (row) => {
        return formatPersonNames({
          chineseName: row.person.chineseName,
          firstName: row.person.firstName,
          lastName: row.person.lastName,
        });
      },
    },
    { title: "Role", prop: "role" },
    { title: "Start Date", prop: "startDate" },
    { title: "End Date", prop: "endDate" },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    if (schoolYearId) {
      RegistrationService.getManageStaffAssignment(schoolYearId).then(
        (response) => {
          if (response && response.data) {
            setContent({
              isLoaded: true,
              items: response.data.staffAssignments,
              schoolYear: response.data.schoolYear,
            });
          }
        }
      );
    }
  }, [schoolYearId]);

  return (
    <Card size="flex">
      <CardBody>
        {content.schoolYear && (
          <CardTitle>Staff Assignments for {content.schoolYear.name}</CardTitle>
        )}
        <Table
          header={header}
          items={content.items}
          isLoaded={content.isLoaded}
          error={content.error}
          sortKey="id"
          showAll="true"
        />
      </CardBody>
    </Card>
  );
};

export default ManageStaffAssignment;
