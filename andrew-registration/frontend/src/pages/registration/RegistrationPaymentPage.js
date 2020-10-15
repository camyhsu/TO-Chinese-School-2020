import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PaymentForm from '../../components/registration/PaymentForm';

export default function RegistrationWaiverPage() {
    const { registerInfo, schoolYear, userData } = useAppContext();
    const history = useHistory();
    var totalPaymentInCents = 0;
    const date = new Date();

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

        if(registerInfo.numStudentsRegistered.registered < 2) {
            totalPaymentInCents += schoolYear.pva_membership_due_in_cents * (2 - registerInfo.numStudentsRegistered.registered);
        }
        totalPaymentInCents += userData.familyAddress.cccaLifetimeMember || registerInfo.numStudentsRegistered.registered > 0 ? 0 : schoolYear.ccca_membership_due_in_cents;

        for(var i = 0; i < registerInfo.studentsToRegister.length; i++) {
            let student = registerInfo.studentsToRegister[i];

            student.registrationFeeInCents = schoolYear.registration_fee_in_cents;
            totalPaymentInCents += schoolYear.registration_fee_in_cents;

            var book = registerInfo.bookCharges.find(book => book.grade_id === student.grade_id);
            student.bookChargeInCents = book.book_charge_in_cents;
            totalPaymentInCents += book.book_charge_in_cents;

            registerInfo.numStudentsRegistered.registered++;
            var tuitionForStudentInCents = schoolYear.tuition_in_cents;
            student.tuitionMessage = '';
            // Early Registration discounts
            if(date.getMonth() < 7) { // early registration
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Early Registration';
                else
                    student.tuitionMessage += ' & Early Registration';
                tuitionForStudentInCents = schoolYear.early_registration_tuition_in_cents;
            }
            // Multiple-Child discount
            if(registerInfo.numStudentsRegistered.registered >= 3) {
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Multiple-Child';
                else
                    student.tuitionMessage += ' & Multiple-Child';
                tuitionForStudentInCents -= schoolYear.tuition_discount_for_three_or_more_child_in_cents;
            }
            // Prorated Registration
            if(date.getMonth() === 11 || date.getMonth() === 12) {
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Prorated Registration';
                else
                    student.tuitionMessage += ' & Prorated Registration';
                tuitionForStudentInCents = (tuitionForStudentInCents * 0.75);
            }
            // Staff and Instructor discounts
            if(staffDiscountAvailable > 0) {
                tuitionForStudentInCents = 0;
                student.tuitionMessage = ' (Staff Discount Applied)';
                staffDiscountAvailable--;
            }
            else if(instructorDiscountAvailable > 0) {
                if(student.tuitionMessage === '')
                    student.tuitionMessage = ' (Instructor ';
                else
                    student.tuitionMessage += ' & Instructor';
                tuitionForStudentInCents -= schoolYear.tuition_discount_for_instructor_in_cents;
                instructorDiscountAvailable--;
            }
            student.tuitionFeeInCents = tuitionForStudentInCents;
            student.tuitionMessage += student.tuitionMessage === '' ? '' : ' Discount Applied)';
            totalPaymentInCents += tuitionForStudentInCents;
        }
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
                    <p><b>Books / Material: </b> ${convertCentsToDollar(entry.bookChargeInCents)}</p>
                    <hr></hr>
                </div>
            ))}
            <div>
                <p><b>PVA Annual Membership Fee: </b> ${registerInfo.numStudentsRegistered.registered - registerInfo.studentsToRegister.length < 2 ? convertCentsToDollar(schoolYear.pva_membership_due_in_cents * (2 - (registerInfo.numStudentsRegistered.registered - registerInfo.studentsToRegister.length))) : convertCentsToDollar(0)}</p>
                <p><b>CCCA Annual Membership Fee: </b> ${userData.familyAddress.cccaLifetimeMemberr || registerInfo.numStudentsRegistered.registered > 0 ? convertCentsToDollar(0) : convertCentsToDollar(schoolYear.ccca_membership_due_in_cents)}</p>
                <hr></hr>
                <p><b>Grand Total: </b> ${convertCentsToDollar(totalPaymentInCents)}</p>
            </div>
            <PaymentForm />
            <Button onClick={cancel}>Cancel Registration</Button>
        </>
        
    )
}