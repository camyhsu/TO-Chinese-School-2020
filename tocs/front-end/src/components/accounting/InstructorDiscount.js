import React, { useState, useEffect } from "react";
import AccountingService from "../../services/accounting.service";
import {
  dollar,
  formatPersonNames,
  bilingualName,
} from "../../utils/utilities";
import { Card, CardTitle, CardBody } from "../Cards";
import Table from "../Table";

const InstructorDiscount = ({ location } = {}) => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const header = [
    {
      title: "Class Name",
      cell: (row) => {
        const schoolClass = row.schoolClass;
        return `${bilingualName(schoolClass)}`;
      },
    },
    {
      title: "Instructor Name",
      cell: (row) => formatPersonNames(row.instructor),
    },
    {
      title: "Child One Name",
      cell: (row) => {
        if (
          row.instructor &&
          row.instructor.children &&
          row.instructor.children.length
        ) {
          const childOne = row.instructor.children[0];
          return formatPersonNames(childOne);
        }
        return "";
      },
    },
    {
      title: "Child Two Name",
      cell: (row) => {
        if (
          row.instructor &&
          row.instructor.children &&
          row.instructor.children.length > 1
        ) {
          const childTwo = row.instructor.children[1];
          return formatPersonNames(childTwo);
        }
        return "";
      },
    },
    {
      title: "Discount",
      cell: (row) =>
        row.instructor.discount || row.instructor.discount === 0
          ? dollar(row.instructor.discount)
          : "",
    },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    AccountingService.getInstructorDiscounts().then(
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
  }, []);

  return (
    <Card size="no-max-width">
      <CardTitle>Instructor Discount</CardTitle>
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

export default InstructorDiscount;
