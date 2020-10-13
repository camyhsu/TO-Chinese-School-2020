import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PaymentForm from '../../components/registration/PaymentForm';

export default function RegistrationWaiverPage() {
    const { registerList, schoolYear, userData } = useAppContext();
    const [staffStatus, setStaffStatus] = useState();
    const history = useHistory();
    const registrationFee = 35;
    const PVAFee = 15;
    const CCCAFee = 20;
    const PreKTo8BookFee = 20;
    const tuitionFee = 535;
    const proratedTuitionFee = 401.25;
    var totalPayment = 0;
    const date = new Date();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const staffResponse = await fetch(`/registration/staff/status?user=${userData.person.personId}&&year=${schoolYear.id}`);
                if( staffResponse.status === 200 ) {
                    var staffJson = await staffResponse.json();
                    if(parseInt(staffJson[0].status) > 0) {
                        setStaffStatus(1);
                    }
                }
                else {
                    alert('Failed to check staff status. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    })

    function cancel() {
        history.push(`/registration/home`);
    }

    for(var i = 0; i < registerList.length; i++) {
        totalPayment += registrationFee;
        totalPayment += PreKTo8BookFee;
        if(i === 0 && staffStatus === 1) {
            totalPayment += 0;
        }
        else {
            totalPayment += date.getMonth() === 11 || date.getMonth() === 12 ? proratedTuitionFee : tuitionFee;
        }
    }
    totalPayment += registerList.length > 1 ? PVAFee * 2 : PVAFee;
    totalPayment += userData.family.cccaLifetimeMember ? 0 : CCCAFee;

    return (
        <>
            <h3>Tution and Fees For {schoolYear.name} School Year</h3>
            {registerList.map((entry, key) => (
                <div key={key}>
                    <p>For {entry.chinese_name}({entry.english_first_name} {entry.english_last_name})</p>
                    <p>entering grade {entry.curr_grade_name}</p>
                    <p><b>Registration Fee: </b> ${registrationFee.toFixed(2)}</p>
                    {key === 0 && staffStatus === 1 ? <p><b>Tuition (Staff Discount Applied): </b> $0.00</p> : 
                        <p><b>Tuition: </b>${date.getMonth() === 11 || date.getMonth() === 12 ? proratedTuitionFee.toFixed(2) : tuitionFee.toFixed(2)}</p>}
                    <p><b>Books / Material: </b> ${PreKTo8BookFee.toFixed(2)}</p>
                    <hr></hr>
                </div>
            ))}
            <div>
                <p><b>PVA Annual Membership Fee: </b> ${registerList.length > 1 ? PVAFee.toFixed(2) * 2 : PVAFee.toFixed(2)}</p>
                <p><b>CCCA Annual Membership Fee: </b> ${userData.family.cccaLifetimeMember ? 0 : CCCAFee.toFixed(2)}</p>
                <hr></hr>
                <p><b>Grand Total: </b> ${totalPayment.toFixed(2)}</p>
            </div>
            <PaymentForm />
            <Button onClick={cancel}>Cancel Registration</Button>
        </>
        
    )
}