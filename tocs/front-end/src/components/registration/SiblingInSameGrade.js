import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RegistrationService from "../../services/registration.service";
import { formatPersonNames } from "../../utils/utilities";
import { Card, CardTitle, CardBody } from "../Cards";
import Table from "../Table";

const SiblingInSameGrade = () => {
  const { schoolYearId } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });

  const header = [
    { title: "Student Name", cell: (row) => formatPersonNames(row.student) },
    {
      title: "Parent One",
      cell: (row) => formatPersonNames(row.family.parentOne),
    },
    {
      title: "Parent Two",
      cell: (row) => formatPersonNames(row.family.parentTwo),
    },
    {
      title: "Family Phone Number",
      cell: (row) => row.family.address.homePhone,
    },
    { title: "Family Email", cell: (row) => row.family.address.email },
    { title: "Grade", cell: (row) => row.grade.shortName },
    {
      title: "School Class Assigned",
      cell: (row) => row.schoolClass.shortName,
    },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getSiblingInSameGradeReport(schoolYearId).then(
      (response) => {
        setContent({
          isLoaded: true,
          items: response.data,
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content },
        });
      }
    );
  }, [schoolYearId]);

  return (
    <Card size="no-max-width">
      <CardTitle>Sibling in Same Grade Report</CardTitle>
      <CardBody>
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

export default SiblingInSameGrade;
