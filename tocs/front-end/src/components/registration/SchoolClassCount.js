import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RegistrationService from "../../services/registration.service";
import { Card, CardTitle, CardBody } from "../Cards";
import Table from "../Table";
import { formatPersonNames } from "../../utils/utilities";

const SchoolClassCount = () => {
  const { classType, schoolYearId } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");

  const now = new Date().toLocaleString("en-US");
  const printPerson = (p) => (
    <>
      {formatPersonNames(p)}
      <br />
      {p.email}
      <br />
      {p.homePhone}
    </>
  );
  const header = [
    { title: "班級", cell: (row) => `${row.chineseName}(${row.englishName})` },
    { title: "人數", prop: "size" },
    { title: "教室", prop: "location" },
    {
      title: "老師",
      cell: (row) => {
        if (row.instructorAssignments) {
          const ps = row.instructorAssignments["Primary Instructor"];
          return (
            ps &&
            ps.length &&
            ps.map((c, i) => (
              <React.Fragment key={"pi-" + i}>
                {(i && <br />) || ""}
                {printPerson(c.instructor)}
              </React.Fragment>
            ))
          );
        }
        return null;
      },
    },
    {
      title: "Room Parent and Email",
      cell: (row) => {
        if (row.instructorAssignments) {
          const ps = row.instructorAssignments["Room Parent"];
          return (
            ps &&
            ps.length &&
            ps.map((c, i) => (
              <React.Fragment key={"rp-" + i}>
                {(i && <br />) || ""}
                {printPerson(c.instructor)}
              </React.Fragment>
            ))
          );
        }
        return null;
      },
    },
    { title: "Maximum Size", prop: "maxSize" },
    { title: "Minimum Age", prop: "minAge" },
    { title: "Maximum Age", prop: "maxAge" },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getSchoolClassCount(classType, schoolYearId).then(
      (response) => {
        setContent({
          isLoaded: true,
          items: response.data.items,
        });
        setTitle(
          `千橡中文學校  ${response.data.title}學年度  ${
            classType === "elective" ? "Elective Class" : "班級"
          }人數清單`
        );
        if (response.data.items) {
          setTotal(response.data.items.reduce((r, c) => r + +c.size, 0));
        }
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
  }, [classType, schoolYearId]);

  return (
    <Card size="no-max-width">
      <CardTitle>{title}</CardTitle>
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

      <dl className="row">
        <dt className="col-12 col-md-6 text-md-right">Total Student Count:</dt>
        <dd className="col-12 col-md-6">{total}</dd>
      </dl>
      <dl className="row">
        <dt className="col-12 col-md-6 text-md-right">Current Time:</dt>
        <dd className="col-12 col-md-6">{now}</dd>
      </dl>
    </Card>
  );
};

export default SchoolClassCount;
