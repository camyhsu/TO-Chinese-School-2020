import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { dollar } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const Home = ({ location } = {}) => {
    const [id, setId] = useState(null);
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const dispatch = useDispatch();

    useEffect(() => {
        const { id } = queryString.parse(location.search);
        setId(id);
        if (id) {
            RegistrationService.getSchoolYear(id).then((response) => {
                if (response && response.data) {
                    setContent({
                        isLoaded: true,
                        item: response.data
                    })
                }
            });
        }
    }, [dispatch, location.search]);

    const sy = content.item;
    return (
        <Card size="large">
                <CardBody>
                    <dl className="row">
                        <dt className="col-12 col-md-6 text-left text-md-right">Registration Fee:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.registrationFee)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Early Registration Tuition:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.earlyRegistrationTuition)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Tuition:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.tuition)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Tuition Discount for 3 or more child:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.tuitionDiscountForThreeOrMoreChild)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Tuition Discount for PreK:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.tuitionDiscountForPreK)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Tuition Discount for Instructor:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.tuitionDiscountForInstructor)}</dd>

                        <dt className="col-12 col-md-6 text-left text-md-right">Book / Material Charge:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0"></dd>

                        <dt className="col-12 col-md-6 text-left text-md-right">PVA Membership Due:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.pvaMembershipDue)}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">CCCA Membership Due:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(sy.cccaMembershipDue)}</dd>
                    </dl>

                    <div>The following dates are related to registration fee proration.
                        <ul>
                            <li>Early Registration Start Date - the date early registration starts.
                                During early registration period, early registration tuition would be charged.</li>
                            <li>Early Registration End Date - the date after which early registration is no longer available.</li>
                            <li>Registration Start Date - the date regular registration starts.</li>
                            <li>Registration 75 Percent Date - the date after which 75% of full tuition would be charged.</li>
                            <li>Registration End Date - the date after which no registration is allowed.</li>
                            <li>Refund 90 Percent Date - the date after which only 90% of full tuition would be refunded.</li>
                            <li>Refund 50 Percent Date - the date after which only 50% of full tuition would be refunded.</li>
                            <li>Refund End Date - the date after which no refund would be allowed.</li>
                        </ul>
                    </div>
                    <dl className="row">
                        <dt className="col-12 col-md-6 text-left text-md-right">Early Registration Start Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.earlyRegistrationStartDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Early Registration End Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.earlyRegistrationEndDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Registration Start Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.registrationStartDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Registration 75 Percent Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.registration75PercentDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Registration End Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.registrationEndDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Refund 50 Percent Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.refund50PercentDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Refund 90 Percent Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.refund90PercentDate}</dd>
                        <dt className="col-12 col-md-6 text-left text-md-right">Refund End Date:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{sy.refundEndDate}</dd>
                    </dl>
                    <div className="card-footer row">
                        <div className="col-md-4">
                            <Link to={`/school-year-form?id=${id}`} className="btn btn-light"><i className="bi-pencil"></i> School Year</Link>
                        </div>
                        <div className="col-md-6">
                            <Link to="/admin/school-years" className="btn btn-light">Back to School Year List</Link>
                        </div>
                    </div>
                </CardBody>
        </Card>
    );
};

export default Home;