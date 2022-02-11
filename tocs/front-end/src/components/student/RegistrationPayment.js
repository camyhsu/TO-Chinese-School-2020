import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StudentParentService from "../../services/student-parent.service";
import RegistrationPaymentDetails from "./RegistrationPaymentDetails";
import GatewayTransaction from "./GatewayTransaction";

const RegistrationPayment = () => {
  const { viewType, paymentId } = useParams();
  const forStaff = viewType === "staff";
  const [content, setContent] = useState("");

  useEffect(() => {
    document.title = "TOCS - Registration Payment";

    StudentParentService.getRegistrationPayment(paymentId, forStaff).then(
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
  }, [paymentId, forStaff]);

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
