import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import StudentParentService from '../../services/student-parent.service';
import RegistrationPaymentDetails from './RegistrationPaymentDetails';
import GatewayTransaction from './GatewayTransaction';

const RegistrationPayment = ({ location } = {}) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const { id } = queryString.parse(location.search);
        document.title = "TOCS - Registration Payment";
        StudentParentService.getRegistrationPayment(id).then(response => {
            setContent({
                isLoaded: true,
                registrationPayment: response.data,
                gatewayTransaction: response.data.gatewayTransactions && response.data.gatewayTransactions[0],
            });
        });
    }, [location.search]);

    const gatewayTransaction = content.gatewayTransaction;
    const registrationPayment = content.registrationPayment;
    return (
        <>
            {gatewayTransaction && (<GatewayTransaction gatewayTransaction={gatewayTransaction} />)}
            {registrationPayment && (<RegistrationPaymentDetails registrationPayment={registrationPayment} />)}
        </>
    );
};

export default RegistrationPayment;