import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import { addSchoolYear, saveSchoolYear, getSchoolYear } from '../../actions/registration.action';

import { decimal, required } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const SchoolYearForm = ({ location } = {}) => {
    const form = useRef();
    const checkBtn = useRef();

    const [id, setId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ageCutoffMonth, setAgeCutoffMonth] = useState('1');
    const [registrationFee, setRegistrationFee] = useState('20.0');
    const [earlyRegistrationTuition, setEarlyRegistrationTuition] = useState('380.0');
    const [tuition, setTuition] = useState('380.0');
    const [tuitionDiscountForThreeOrMoreChild, setTuitionDiscountForThreeOrMoreChild] = useState('38.0');
    const [tuitionDiscountForPreK, setTuitionDiscountForPreK] = useState('40.0');
    const [tuitionDiscountForInstructor, setTuitionDiscountForInstructor] = useState('0.0');
    const [pvaMembershipDue, setPvaMembershipDue] = useState('15.0');
    const [cccaMembershipDue, setCccaMembershipDue] = useState('20.0');
    const [earlyRegistrationStartDate, setEarlyRegistrationStartDate] = useState('');
    const [earlyRegistrationEndDate, setEarlyRegistrationEndDate] = useState('');
    const [registrationStartDate, setRegistrationStartDate] = useState('');
    const [registration75PercentDate, setRegistration75PercentDate] = useState('');
    const [registrationEndDate, setRegistrationEndDate] = useState('');
    const [refund90PercentDate, setRefund90PercentDate] = useState('');
    const [refund50PercentDate, setRefund50PercentDate] = useState('');
    const [refundEndDate, setRefundEndDate] = useState('');

    const [formTitle, setFormTitle] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);

    const dispatch = useDispatch();

    const fns = useMemo(() => ({
        'id': setId,
        'name': setName,
        'description': setDescription,
        'startDate': setStartDate,
        'endDate': setEndDate,
        'ageCutoffMonth': setAgeCutoffMonth,
        'registrationFee': setRegistrationFee,
        'earlyRegistrationTuition': setEarlyRegistrationTuition,
        'tuition': setTuition,
        'tuitionDiscountForThreeOrMoreChild': setTuitionDiscountForThreeOrMoreChild,
        'tuitionDiscountForPreK': setTuitionDiscountForPreK,
        'tuitionDiscountForInstructor': setTuitionDiscountForInstructor,
        'pvaMembershipDue': setPvaMembershipDue,
        'cccaMembershipDue': setCccaMembershipDue,
        'earlyRegistrationStartDate': setEarlyRegistrationStartDate,
        'earlyRegistrationEndDate': setEarlyRegistrationEndDate,
        'registrationStartDate': setRegistrationStartDate,
        'registration75PercentDate': setRegistration75PercentDate,
        'registrationEndDate': setRegistrationEndDate,
        'refund90PercentDate': setRefund90PercentDate,
        'refund50PercentDate': setRefund50PercentDate,
        'refundEndDate': setRefundEndDate,
    }), []);

    useEffect(() => {
        const { id } = queryString.parse(location.search);
        setFormTitle(`${id ? 'Edit' : 'Add'} School Year`);
        if (id) {
            dispatch(getSchoolYear(id)).then((response) => {
                if (response && response.data) {
                    Object.entries(response.data).forEach(([key, value]) => fns[key] && fns[key](value || ''));
                }
            });
        }
    }, [dispatch, fns, location.search]);

    const onChangeField = (e) => {
        const { name, value } = e.target;
        fns[name](value);
    };

    const handleSave = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            const obj = {
                name, description,
                startDate, endDate, ageCutoffMonth,
                registrationFee, earlyRegistrationTuition, tuition,
                tuitionDiscountForThreeOrMoreChild, tuitionDiscountForPreK, tuitionDiscountForInstructor,
                pvaMembershipDue, cccaMembershipDue,
                earlyRegistrationStartDate, earlyRegistrationEndDate,
                registrationStartDate, registration75PercentDate, registrationEndDate,
                refund90PercentDate, refund50PercentDate, refundEndDate,
            };
            dispatch(id ? saveSchoolYear(id, obj) : addSchoolYear(obj)).then(() => {
                setSuccessful(true);
            }).catch(() => {
                setSuccessful(false);
            });
        }
    };

    return (
        <>
            {successful && (<Redirect to={redirect} />)}
            <Card size="xlarge">
                    <CardBody>

                        <Form onSubmit={handleSave} ref={form}>
                            {!successful && (
                                <div>
                                    <h4>{formTitle}</h4>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="name">Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={name}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="description">Description <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="description"
                                                value={description}
                                                onChange={onChangeField}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="startDate">Start Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="startDate"
                                                value={startDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="endDate">End Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="endDate"
                                                value={endDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="ageCutoffMonth">Age Cutoff Month</label>
                                            <Select
                                                className="form-control"
                                                name="ageCutoffMonth"
                                                value={ageCutoffMonth}
                                                onChange={onChangeField}>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                                <option value='4'>4</option>
                                                <option value='5'>5</option>
                                                <option value='6'>6</option>
                                                <option value='7'>7</option>
                                                <option value='8'>8</option>
                                                <option value='9'>9</option>
                                                <option value='10'>10</option>
                                                <option value='11'>11</option>
                                                <option value='12'>12</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="registrationFee">Registration Fee</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="registrationFee"
                                                value={decimal(registrationFee)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="earlyRegistrationTuition">Early Registration Tuition</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="earlyRegistrationTuition"
                                                value={decimal(earlyRegistrationTuition)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="tuition">Tuition</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="tuition"
                                                value={decimal(tuition)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="tuitionDiscountForThreeOrMoreChild">Tuition Discount<br />For 3 Or More Child</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="tuitionDiscountForThreeOrMoreChild"
                                                value={decimal(tuitionDiscountForThreeOrMoreChild)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="tuitionDiscountForPreK">Tuition Discount<br />For Pre-K</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="tuitionDiscountForPreK"
                                                value={decimal(tuitionDiscountForPreK)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="tuitionDiscountForInstructor">Tuition Discount<br />For Instructor</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="tuitionDiscountForInstructor"
                                                value={decimal(tuitionDiscountForInstructor)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="pvaMembershipDue">PVA Membership Due</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="pvaMembershipDue"
                                                value={decimal(pvaMembershipDue)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="cccaMembershipDue">CCCA Membership Due</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="cccaMembershipDue"
                                                value={decimal(cccaMembershipDue)}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="earlyRegistrationStartDate">Early Registration Start Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="earlyRegistrationStartDate"
                                                value={earlyRegistrationStartDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="earlyRegistrationEndDate">Early Registration End Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="earlyRegistrationEndDate"
                                                value={earlyRegistrationEndDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="registrationStartDate">Registration Start Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="registrationStartDate"
                                                value={registrationStartDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="registration75PercentDate">Registration 75% Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="registration75PercentDate"
                                                value={registration75PercentDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="registrationEndDate">Registration End Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="registrationEndDate"
                                                value={registrationEndDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="refund50PercentDate">Refund 50% Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="refund50PercentDate"
                                                value={refund50PercentDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="refund90PercentDate">Refund 90% Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="refund90PercentDate"
                                                value={refund90PercentDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="refundEndDate">Refund End Date</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="refundEndDate"
                                                value={refundEndDate}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <button className="btn btn-primary btn-block">Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="form-group">
                                    <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                            <CheckButton style={{ display: "none" }} ref={checkBtn} />
                        </Form>
                    </CardBody>
            </Card>
        </>
    );
};

export default SchoolYearForm;