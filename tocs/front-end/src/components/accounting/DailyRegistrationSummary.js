import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AccountingService from "../../services/accounting.service";
import { dollar } from "../../utils/utilities";
import Table from "../Table";
import { Card, CardTitle, CardBody } from "../Cards";

const DailyRegistrationSummary = () => {
  const { schoolYearId, schoolYearName } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const header = [
    { title: "Date", prop: "paymentDate" },
    { title: "Registered Student Count", prop: "studentCount" },
    { title: "Registration", cell: (row) => dollar(row.registrationFee) },
    { title: "Tuition", cell: (row) => dollar(row.tuition) },
    { title: "Book Charge", cell: (row) => dollar(row.bookCharge) },
    { title: "PVA", cell: (row) => dollar(row.pvaDue) },
    { title: "CCCA", cell: (row) => dollar(row.cccaDue) },
    { title: "Total Amount Paid", cell: (row) => dollar(row.grandTotal) },
  ];
  useEffect(() => {
    document.title = "TOCS - Home";

    AccountingService.getDailyRegistrationSummary(schoolYearId).then(
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
      <CardTitle>
        Daily Registration Summary For {schoolYearName} School Year
      </CardTitle>
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

export default DailyRegistrationSummary;
