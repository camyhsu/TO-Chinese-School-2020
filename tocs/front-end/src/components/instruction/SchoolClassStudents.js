import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InstructionService from "../../services/instruction.service";
import {
  formatPersonNames,
  formatBirthInfo,
  formatPhoneNumber,
  now,
} from "../../utils/utilities";
import { Card, CardTitle, CardBody } from "../Cards";
import Table from "../Table";

const SchoolClassStudents = () => {
  const { schoolClassId, schoolYearId } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });

  const electiveHeader = [
    { title: "學生", cell: (row) => formatPersonNames(row.student) },
    { title: "班級", cell: (row) => row.schoolClass.shortName },
    { title: "生年月", cell: (row) => formatBirthInfo(row.student) },
    { title: "性别", cell: (row) => row.student.gender },
    {
      title: "Parents",
      cell: (row) => (
        <>
          {formatPersonNames(row.student.family.parentOne)}
          {", " + formatPersonNames(row.student.family.parentTwo)}
        </>
      ),
    },
    { title: "Email", cell: (row) => row.student.family.address.email },
    {
      title: "電話",
      cell: (row) => formatPhoneNumber(row.student.family.address.homePhone),
    },
  ];

  const nonElectiveHeader = electiveHeader.concat([]);
  nonElectiveHeader.splice(1, 1);

  console.log(electiveHeader.length, nonElectiveHeader.length);
  useEffect(() => {
    document.title = "TOCS - Home";

    const extract = (instructorAssignments, role) => {
      if (instructorAssignments[role] && instructorAssignments[role].length) {
        return instructorAssignments[role][0].instructor;
      }
      return null;
    };

    if (schoolClassId && schoolYearId) {
      InstructionService.getSchoolClass(schoolClassId, schoolYearId).then(
        (response) => {
          const {
            instructorAssignments,
            schoolClass,
            studentClassAssignments,
          } = response.data;
          let primaryInstructor, roomParent;
          if (instructorAssignments) {
            primaryInstructor = extract(
              instructorAssignments,
              "Primary Instructor"
            );
            roomParent = extract(instructorAssignments, "Room Parent");
          }

          setContent({
            isLoaded: true,
            schoolClass,
            studentClassAssignments,
            primaryInstructor,
            roomParent,
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
    }
  }, [schoolClassId, schoolYearId]);

  return (
    (content.schoolClass && (
      <Card size="no-max-width">
        <CardTitle>{content.schoolClass.chineseName}</CardTitle>
        <CardBody>
          <div className="row">
            <div className="col-md-4">{`${formatPersonNames(
              content.primaryInstructor
            )} 老師`}</div>
            <div className="col-md-4">教室: {content.schoolClass.location}</div>
            <div className="col-md-4">
              Room Parent: {`${formatPersonNames(content.roomParent)}`}
            </div>
          </div>
          <Table
            header={
              content.schoolClass.schoolClassType === "ELECTIVE"
                ? electiveHeader
                : nonElectiveHeader
            }
            items={content.studentClassAssignments}
            isLoaded={content.isLoaded}
            error={content.error}
            sortKey="id"
            showAll="true"
          />

          <dl className="row">
            <dt className="col-12 col-md-6 text-md-right">
              Total Student Count:
            </dt>
            <dd className="col-12 col-md-6">
              {content.studentClassAssignments.length}
            </dd>
          </dl>
          <dl className="row">
            <dt className="col-12 col-md-6 text-md-right">Current Time:</dt>
            <dd className="col-12 col-md-6">{now()}</dd>
          </dl>
        </CardBody>
      </Card>
    )) ||
    null
  );
};

export default SchoolClassStudents;
