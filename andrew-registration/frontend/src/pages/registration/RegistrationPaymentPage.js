import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PaymentForm from '../../components/registration/PaymentForm';

export default function RegistrationWaiverPage() {
    const { registerInfo, schoolYear, userData } = useAppContext();
    const history = useHistory();
    const registrationFeeInCents = 3500;
    const PVAFeeInCents = 1500;
    const CCCAFeeInCents = 2000;
    const PreKTo8BookFeeInCents = 2000;
    const instructorDiscountInCents = 6000;
    var tuitionFeeInCents = 53500;
    var totalPaymentInCents = 0;
    const staffStatus = 1;
    const date = new Date();
    date.setMonth(6);

    function convertCentsToDollar(amountInCents) {
        var amountInDollars = amountInCents/100;
        return amountInDollars.toFixed(2);
    }

    function cancel() {
        history.push(`/registration/home`);
    }

    const calculatePayment = () => {
        var staffDiscountAvailable = registerInfo.discountsAvailable.staff_discount - registerInfo.numStudentsRegistered.staff_count;
        var instructorDiscountAvailable = registerInfo.discountsAvailable.instructor_discount !== '0' ? 2 - registerInfo.numStudentsRegistered.instructor_count : 0;
        for(var i = 0; i < registerInfo.studentsToRegister.length; i++) {
            var student = registerInfo.studentsToRegister[i];
            student.registrationFeeInCents = registrationFeeInCents;
            totalPaymentInCents += registrationFeeInCents;

            student.PreKTo8BookFeeInCents = PreKTo8BookFeeInCents;
            totalPaymentInCents += PreKTo8BookFeeInCents;

            registerInfo.numStudentsRegistered.registered++;
            var tuitionForStudentInCents = tuitionFeeInCents;
            student.tuitionMessage = '';
            // Multiple-Child discount
            if(registerInfo.numStudentsRegistered.registered >= 3) {
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Multiple-Child';
                else
                    student.tuitionMessage += ' & Multiple-Child';
                tuitionForStudentInCents -= 4000;
            }
            // Early and Prorated Registration discounts
            if(date.getMonth() < 7) { // early registration
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Early Registration';
                else
                    student.tuitionMessage += ' & Early Registration';
                tuitionForStudentInCents -= 5000;
            }
            else if(date.getMonth() === 11 || date.getMonth() === 12) { // prorated registration
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Prorated Registration';
                else
                    student.tuitionMessage += ' & Prorated Registration';
                tuitionForStudentInCents = (tuitionForStudentInCents * 0.75);
            }
            // Staff and Instructor discounts
            if(staffDiscountAvailable > 0) {
                student.tuitionFeeInCents = 0;
                student.tuitionMessage = ' (Staff Discount Applied)';
                staffDiscountAvailable--;
                continue;
            }
            else if(instructorDiscountAvailable > 0) {
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Instructor ';
                else
                    student.tuitionMessage += ' & Instructor';
                tuitionForStudentInCents -= instructorDiscountInCents;
                instructorDiscountAvailable--;
            }
            student.tuitionFeeInCents = tuitionForStudentInCents;
            student.tuitionMessage += student.tuitionMessage === '' ? '' : ' Discount Applied)';
            totalPaymentInCents += tuitionForStudentInCents;
        }
        totalPaymentInCents += registerInfo.numStudentsRegistered.registered >= 2 ? PVAFeeInCents * 2 : PVAFeeInCents;
        totalPaymentInCents += userData.family.cccaLifetimeMember ? 0 : CCCAFeeInCents;
    }
    calculatePayment();

    return (
        <>
            <h3>Tution and Fees For {schoolYear.name} School Year</h3>
            {registerInfo.studentsToRegister.map((entry, key) => (
                <div key={key}>
                    <p>For {entry.chinese_name}({entry.english_first_name} {entry.english_last_name})</p>
                    <p>entering grade {entry.curr_grade_name}</p>
                    <p><b>Registration Fee: </b> ${convertCentsToDollar(entry.registrationFeeInCents)}</p>
                    <p><b>Tuition{entry.tuitionMessage}: </b>${convertCentsToDollar(entry.tuitionFeeInCents)}</p>
                    <p><b>Books / Material: </b> ${convertCentsToDollar(entry.PreKTo8BookFeeInCents)}</p>
                    <hr></hr>
                </div>
            ))}
            <div>
                <p><b>PVA Annual Membership Fee: </b> ${registerInfo.numStudentsRegistered.registered >= 2 ? convertCentsToDollar(PVAFeeInCents * 2): convertCentsToDollar(PVAFeeInCents)}</p>
                <p><b>CCCA Annual Membership Fee: </b> ${userData.family.cccaLifetimeMember ? 0 : convertCentsToDollar(CCCAFeeInCents)}</p>
                <hr></hr>
                <p><b>Grand Total: </b> ${convertCentsToDollar(totalPaymentInCents)}</p>
            </div>
            <PaymentForm />
            <Button onClick={cancel}>Cancel Registration</Button>
        </>
        
    )
}