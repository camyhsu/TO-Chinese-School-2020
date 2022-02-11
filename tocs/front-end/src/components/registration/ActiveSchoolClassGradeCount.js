import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RegistrationService from "../../services/registration.service";
import { Card, CardTitle, CardBody } from "../Cards";
import Table from "../Table";

const ActiveSchoolClassGradeCount = () => {
  const { schoolYearId } = useParams();

  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");

  const now = new Date().toLocaleString("en-US");
  const header = [
    {
      title: "年級",
      cell: (row) => `${row.grade.chinese_name}(${row.grade.english_name})`,
    },
    { title: "人數", prop: "cnt" },
    { title: "Maximum Size", prop: "maxSize" },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getActiveSchoolClassGradeCount(schoolYearId).then(
      (response) => {
        setContent({
          isLoaded: true,
          items: response.data.items,
        });
        setTitle(response.data.title);
        if (response.data.items) {
          setTotal(response.data.items.reduce((r, c) => r + +c.cnt, 0));
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
  }, [schoolYearId]);

  return (
    <Card size="no-max-width">
      <CardTitle>千橡中文學校 {title}學年度 年級人數清單</CardTitle>
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

export default ActiveSchoolClassGradeCount;
