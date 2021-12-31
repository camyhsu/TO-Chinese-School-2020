import React, { useState, useEffect } from "react";
import AccountingService from "../../services/accounting.service";
import { dollar, formatPersonNames } from "../../utils/utilities";
import Table from "../Table";
import { Card, CardTitle, CardBody } from "../Cards";

const ManualTransactions = () => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const header = [
    { title: "Date", prop: "transactionDate" },
    {
      title: "Executed By",
      cell: (row) => formatPersonNames(row.transactionBy),
    },
    { title: "Student", cell: (row) => formatPersonNames(row.student) },
    { title: "Transaction Type", prop: "transactionType" },
    { title: "Payment Method", prop: "paymentMethod" },
    { title: "Amount", cell: (row) => dollar(row.amountInCents / 100) },
  ];
  useEffect(() => {
    document.title = "TOCS - Home";

    AccountingService.getManualTransactionsForLastTwoYears().then(
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
      <CardTitle>Manual Transactions From Last Two School Years</CardTitle>
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

export default ManualTransactions;
