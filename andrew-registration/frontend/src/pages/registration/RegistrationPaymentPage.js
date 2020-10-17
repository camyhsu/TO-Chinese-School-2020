import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PaymentForm from '../../components/registration/PaymentForm';

export default function RegistrationWaiverPage() {
    const { registerInfo, schoolYear, userData } = useAppContext();
    const history = useHistory();
    var totalPaymentInCents = 0;
    var pvaMembershipDueInCents = 0;
    var cccaMembershipDueInCents = 0;
    const date = new Date();
    const today = date.getTime();
    const earlyRegistrationStartDate = new Date(schoolYear.early_registration_start_date);
    const earlyRegistrationEndDate = new Date(schoolYear.early_registration_end_date);
    const proratedRegistrationStartDate = new Date(schoolYear.registration_75_percent_date);
    const registrationEndDate = new Date(schoolYear.registration_end_date);

    function convertCentsToDollar(amountInCents) {
        var amountInDollars = amountInCents/100;
        return amountInDollars.toFixed(2);
    }

    function cancel() {
        history.push(`/registration/home`);
    }

    function tuitionMessage(student) {
        var messageList = [];
        if(student.staff_discount)
            return '(Staff discount applied)';
        if(student.instructor_discount)
            messageList.push('Instructor');
        if(student.multiple_child_discount)
            messageList.push('Multiple Child');
        if(student.early_registration)
            messageList.push('Early Registration');
        if(student.prorate_75)
            messageList.push('Late Registration');

        return messageList.length === 0 ? '' : '(' + messageList.join(', ') + ' discount applied)';
    }

    const calculatePayment = () => {
        if(registerInfo.completedRegistration.registered > 0) {
            // if 1 student already registered, they paid $15, so they pay another $15.
            if(registerInfo.completedRegistration.registered === 1) {
                pvaMembershipDueInCents = schoolYear.pva_membership_due_in_cents;
            }
            // if 2 students already registereed, they paid $30, so they pay 0
            else if(registerInfo.completedRegistration.registered >= 2) {
                pvaMembershipDueInCents = 0;
            }
        }
        else {
            // if no students already registered, pay up to $30, $15 for each student
            for(let i = 0; i < 2 && i < registerInfo.studentsToRegister.length; i++) {
                pvaMembershipDueInCents += schoolYear.pva_membership_due_in_cents;
            }
        }

        if(registerInfo.completedRegistration.registered > 0 || userData.familyAddress.cccaLifetimeMember) {
            cccaMembershipDueInCents = 0;
        }
        else {
            cccaMembershipDueInCents = schoolYear.ccca_membership_due_in_cents;
        }

        var staffDiscountAvailable = registerInfo.discountsAvailable.staff_discount - registerInfo.completedRegistration.staff_count;
        var instructorDiscountAvailable = registerInfo.discountsAvailable.instructor_discount !== '0' ? 2 - registerInfo.completedRegistration.instructor_count : 0;

        totalPaymentInCents += pvaMembershipDueInCents;
        totalPaymentInCents += cccaMembershipDueInCents;
        for(let i = 0; i < registerInfo.studentsToRegister.length; i++) {
            let student = registerInfo.studentsToRegister[i];
            let book = registerInfo.bookCharges.find(book => book.grade_id === student.grade_id);

            student.tuition_in_cents = schoolYear.tuition_in_cents;
            student.registration_fee_in_cents = schoolYear.registration_fee_in_cents;
            student.book_charge_in_cents = book.book_charge_in_cents;
            student.staff_discount = false;
            student.instructor_discount = false;
            student.early_registration = false;
            student.multiple_child_discount = false;
            student.prorate_75 = false;

            totalPaymentInCents += student.book_charge_in_cents;
            totalPaymentInCents += student.registration_fee_in_cents;

            registerInfo.completedRegistration.registered++;

            // Staff discount
            if(staffDiscountAvailable > 0) {
                student.tuition_in_cents = 0;
                student.staff_discount = true;
                staffDiscountAvailable--;
                continue;
            }
            // Early Registration discount
            if(today >= earlyRegistrationStartDate.getTime() && today <= earlyRegistrationEndDate.getTime()) { // early registration
                student.tuition_in_cents = schoolYear.early_registration_tuition_in_cents;
                student.early_registration = true;
            }
            // Multiple-Child discount
            if(registerInfo.completedRegistration.registered >= 3) {
                student.tuition_in_cents -= schoolYear.tuition_discount_for_three_or_more_child_in_cents;
                student.multiple_child_discount = true;
            }
            // Prorated Registration
            if(today >= proratedRegistrationStartDate.getTime() && today <= registrationEndDate.getTime()) {
                student.tuition_in_cents *= 0.75;
                student.prorate_75 = true;
            }
            // Instructor discount
            if(instructorDiscountAvailable > 0) {
                student.tuition_in_cents -= schoolYear.tuition_discount_for_instructor_in_cents;
                student.instructor_discount = true;
                instructorDiscountAvailable--;
            }
            totalPaymentInCents += student.tuition_in_cents;
        }
    }
    calculatePayment();

    return (
        <>
            <h3>Tution and Fees For {schoolYear.name} School Year</h3>
            {registerInfo.studentsToRegister.map((entry, key) => (
                <div key={key}>
                    <p>For {entry.chinese_name}({entry.english_first_name} {entry.english_last_name})</p>
                    <p>entering grade {entry.grade_name}</p>
                    <p><b>Registration Fee: </b> ${convertCentsToDollar(entry.registration_fee_in_cents)}</p>
                    <p><b>Tuition{tuitionMessage(entry)}: </b>${convertCentsToDollar(entry.tuition_in_cents)}</p>
                    <p><b>Books / Material: </b> ${convertCentsToDollar(entry.book_charge_in_cents)}</p>
                    <hr></hr>
                </div>
            ))}
            <div>
                <p><b>PVA Annual Membership Fee: </b> ${convertCentsToDollar(pvaMembershipDueInCents)}</p>
                <p><b>CCCA Annual Membership Fee: </b> ${convertCentsToDollar(cccaMembershipDueInCents)}</p>
                <hr></hr>
                <p><b>Grand Total: </b> ${convertCentsToDollar(totalPaymentInCents)}</p>
            </div>
            <PaymentForm cccaMembershipDueInCents={cccaMembershipDueInCents} pvaMembershipDueInCents={pvaMembershipDueInCents} totalPaymentInCents={totalPaymentInCents}/>
            <Button onClick={cancel}>Cancel Registration</Button>
        </>
        
    )
}