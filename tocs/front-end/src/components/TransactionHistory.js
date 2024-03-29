import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "./Cards";
import Table from "./Table";
import StudentParentService from "../services/student-parent.service";
import { isoToPacific, dollar, BiInfoCircle } from "../utils/utilities";

const TransactionHistory = () => {
  const [content, setContent] = useState("");
  const rxHeader = [
    {
      cell: (row) => (
        <Link
          to={"/student/registration-payment/parent/" + row.id}
          className="btn btn-light"
        >
          <BiInfoCircle />
        </Link>
      ),
    },
    { title: "Date", cell: (row) => isoToPacific(row.updatedAt) },
    {
      title: "Type",
      cell: (row) =>
        row.grandTotal < 0 ? "System Adjustment" : "Registration",
    },
    { title: "Amount", cell: (row) => dollar(row.grandTotal) },
  ];
  const mxHeader = [
    { title: "Date", cell: (row) => isoToPacific(row.updatedAt) },
    { title: "Type", prop: "transactionType" },
    { title: "Amount", cell: (row) => dollar(row.amountWithSign) },
  ];

  useEffect(() => {
    document.title = "TOCS - Transaction History";
    StudentParentService.getTransactionHistory().then((response) => {
      setContent({
        isLoaded: true,
        manualTransactions: response.data.manualTransactions,
        registrationPayments: response.data.registrationPayments,
      });
    });
  }, []);

  const manualTransactions = content.manualTransactions;
  const registrationPayments = content.registrationPayments;

  return (
    <Card size="large">
      <CardBody>
        <CardTitle hSize="4">Transaction History</CardTitle>
        {((!manualTransactions && !registrationPayments) ||
          (!manualTransactions.length && !registrationPayments.length)) && (
          <p>No Transaction History</p>
        )}

        {registrationPayments && registrationPayments.length > 0 && (
          <>
            <CardTitle>Registration Transactions</CardTitle>
            <Table
              header={rxHeader}
              items={registrationPayments}
              isLoaded={content.isLoaded}
              error={content.error}
              sortKey="id"
              showAll="true"
            />
          </>
        )}

        {manualTransactions && manualTransactions.length > 0 && (
          <>
            <br />
            <br />
            <CardTitle>Other Transactions</CardTitle>
            <Table
              header={mxHeader}
              items={manualTransactions}
              isLoaded={content.isLoaded}
              error={content.error}
              sortKey="id"
              showAll="true"
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default TransactionHistory;
