import React, { useState, useRef, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';

import { required, getYear, BiCreditCard } from '../../utils/utilities';
import { Card, CardBody, CardTitle } from "../Cards";

const PaymentForm = ({ callback }) => {
    const form = useRef();
    const checkBtn = useRef();
    const [number, setNumber] = useState('');
    const currentYear = getYear();
    const [year, setYear] = useState('' + currentYear);
    const [month, setMonth] = useState('1');
    const [cardCode, setCardCode] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);
    const years = [...new Array(10).keys()].map(i => '' + (i + currentYear));

    const fns = useMemo(() => ({
        'number': setNumber,
        'year': setYear,
        'month': setMonth,
        'cardCode': setCardCode,
    }), []);

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
                number, year, month, cardCode
            };
            callback(obj);
        }
    };

    return (
        <>
            {successful && (<Redirect to={redirect} />)}
            <Card size="medium">
                <CardBody>
                    <Form onSubmit={handleSave} ref={form}>
                        {!successful && (
                            <>
                                <div>
                                    <CardTitle><BiCreditCard /> Enter Credit Card Information</CardTitle>
                                    <p>Chinese School does not save credit card information<br />
                                        <span className="font-weight-bold">Only Visa or MasterCard Credit Cards are accepted</span></p>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6 mb-3">
                                        <label htmlFor="number">Card Number</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="number"
                                            value={number}
                                            onChange={onChangeField}
                                            validations={[required]}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 mb-3">
                                        <label htmlFor="cardCode">Card Code</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="cardCode"
                                            value={cardCode}
                                            onChange={onChangeField}
                                            validations={[required]}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6 mb-3">
                                        <label htmlFor="month">Expiration Month</label>
                                        <Select
                                            className="form-control"
                                            name="month"
                                            value={month}
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
                                    <div className="form-group col-md-6 mb-3">
                                        <label htmlFor="year">Expiration Year</label>
                                        <Select
                                            className="form-control"
                                            name="year"
                                            value={year}
                                            onChange={onChangeField}>
                                            {years.map(y => (<option key={`y-${y}`} value={y}>{y}</option>))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-12 mb-3">
                                        <button className="btn btn-primary btn-block">Save</button>
                                    </div>
                                </div>
                            </>
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

export default PaymentForm;