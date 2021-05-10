import React from "react";
import { Card, CardBody, CardTitle } from "../Cards";
import { dollar, formatPersonNames, labelForTuitionDiscountApplied, bilingualName } from '../../utils/utilities';

const RegistrationPaymentDetails = ({ registrationPayment } = {}) => {
    return (
        <Card size="medium">
            <CardBody>
                <CardTitle>Tuition and Fee For {registrationPayment.schoolYear.name} School Year</CardTitle>
                {registrationPayment.studentFeePayments && registrationPayment.studentFeePayments.map((studentFeePayment, sindex) => {
                    return (
                        <React.Fragment key={'studentFeePayment-' + sindex}>
                            <p>
                                For {formatPersonNames(studentFeePayment.student)}<br />
                                {studentFeePayment.student.registrationPreferences.map((registrationPreference, rindex) => {
                                    return (
                                        <React.Fragment key={'registrationPreferences-' + rindex}>
                                            entering grade {bilingualName(registrationPreference.grade)}<br />
                                            {registrationPreference.electiveClass && (
                                                <>
                                                    selecting elective class {bilingualName(registrationPreference.electiveClass)}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </p>
                            <dl className="row">
                                <dt className="col-12 col-md-9 text-right text-md-right">Registration Fee:</dt>
                                <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(studentFeePayment.registrationFeeInCents, true)}</dd>
                                <dt className="col-12 col-md-9 text-right text-md-right">Tuition{labelForTuitionDiscountApplied(studentFeePayment)}:</dt>
                                <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(studentFeePayment.tuitionInCents, true)}</dd>
                                <dt className="col-12 col-md-9 text-right text-md-right">Books / Material:</dt>
                                <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(studentFeePayment.bookChargeInCents, true)}</dd>
                            </dl>
                            <hr />
                        </React.Fragment>
                    );
                })}
                <dl className="row">
                    <dt className="col-12 col-md-9 text-right text-md-right">PVA Annual Membership:</dt>
                    <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(registrationPayment.pvaDueInCents, true)}</dd>
                    <dt className="col-12 col-md-9 text-right text-md-right">CCCA Annual Membership:</dt>
                    <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(registrationPayment.cccaDueInCents, true)}</dd>
                </dl>
                <hr />
                <dl className="row">
                    <dt className="col-12 col-md-9 text-right text-md-right">Grand Total:</dt>
                    <dd className="col-12 col-md-3 text-right border-bottom border-md-bottom-0">{dollar(registrationPayment.grandTotalInCents, true)}</dd>
                </dl>
            </CardBody>
        </Card>
    );
};

export default RegistrationPaymentDetails;