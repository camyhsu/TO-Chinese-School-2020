import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import RegistrationPaymentDetails from "./RegistrationPaymentDetails";
import StudentParentService from "../../services/student-parent.service";
import PaymentForm from "../forms/PaymentForm";
import { savePayment } from "../../actions/student-parent.action";

const Payment = () => {
  const [content, setContent] = useState("");
  const { registrationPreferencesResponse } = useSelector(
    (state) => state.temp
  );
  const [successful, setSuccessful] = useState(false);
  const { redirect } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const paymentCallback = (payment) => {
    console.log("paymentCallback", payment, registrationPayment);
    dispatch(savePayment(registrationPayment.id, payment)).then((response) => {
      console.log("pppppp", response);
      setSuccessful(true);
    });
  };

  useEffect(() => {
    const ids = registrationPreferencesResponse.registrationPreferences.map(
      (r) => r.id
    );
    StudentParentService.initializeRegistrationPayment(ids).then((response) => {
      setContent({
        isLoaded: true,
        registrationPayment: response.data.registrationPayment,
      });
    });
  }, [registrationPreferencesResponse]);

  const registrationPayment = content.registrationPayment;
  return (
    (registrationPayment && (
      <>
        {successful && <Navigate to={redirect} />}
        <RegistrationPaymentDetails registrationPayment={registrationPayment} />
        <PaymentForm callback={paymentCallback} />
      </>
    )) ||
    null
  );
};

export default Payment;
