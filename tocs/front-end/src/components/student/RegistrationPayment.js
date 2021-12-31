import React, { useState, useEffect } from "react";
import queryString from "query-string";
import StudentParentService from "../../services/student-parent.service";
import RegistrationPaymentDetails from "./RegistrationPaymentDetails";
import GatewayTransaction from "./GatewayTransaction";

const RegistrationPayment = ({ location } = {}) => {
  const [content, setContent] = useState("");
  const [forStaff, setForStaff] = useState("");

  useEffect(() => {
    document.title = "TOCS - Registration Payment";

    const { id, forStaff: _forStaff } = queryString.parse(location.search);
    setForStaff(_forStaff);

    StudentParentService.getRegistrationPayment(id, _forStaff).then(
      (response) => {
        setContent({
          isLoaded: true,
          registrationPayment: response.data,
          gatewayTransaction:
            response.data.gatewayTransactions &&
            response.data.gatewayTransactions[0],
        });
      }
    );
  }, [location.search]);

  const gatewayTransaction = content.gatewayTransaction;
  const registrationPayment = content.registrationPayment;
  const paidBy = registrationPayment && registrationPayment.paidBy;

  return (
    <>
      {gatewayTransaction && (
        <GatewayTransaction
          gatewayTransaction={gatewayTransaction}
          forStaff={forStaff}
          paidBy={paidBy}
        />
      )}
      {registrationPayment && (
        <RegistrationPaymentDetails registrationPayment={registrationPayment} />
      )}
    </>
  );
};

export default RegistrationPayment;
