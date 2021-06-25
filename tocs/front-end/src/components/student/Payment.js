import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RegistrationPaymentDetails from './RegistrationPaymentDetails';
import StudentParentService from '../../services/student-parent.service';

const Payment = () => {
    const [registrationPayment, setRegistrationPayment] = useState();
    const { registrationPreferencesResponse } = useSelector(state => state.temp);

    useEffect(() => {
        const ids = registrationPreferencesResponse.registrationPreferences.map(r => r.id);
        StudentParentService.initializeRegistrationPayment(ids)
            .then(response => {
                console.log(response);
            });
        console.log(registrationPreferencesResponse);
    });

    return (registrationPayment && (
        <>
            <RegistrationPaymentDetails registrationPayment={registrationPayment} raw="true" />
        </>
    )) || null;
};

export default Payment;