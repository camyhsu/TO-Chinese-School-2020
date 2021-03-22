import React, { useState, useRef, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { required, validEmail } from '../utils/utilities';


const PersonForm = ({ location } = {}) => {
    const form = useRef();
    const checkBtn = useRef();

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);

    const callback = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const { params } = location;
        const fn = (v, setter) => v && setter(v);
        fn(params.street, setStreet);
        fn(params.city, setCity)
        fn(params.state, setState)
        fn(params.zipcode, setZipcode)
        fn(params.homePhone, setHomePhone)
        fn(params.cellPhone, setCellPhone)
        fn(params.email, setEmail)

        setTitle(params.title);
        callback.current = params.callback;
    }, [location]);

    const onChangeField = (e) => {
        const { name, value } = e.target;
        const fns = {
            'street': setStreet,
            'city': setCity,
            'state': setState,
            'zipcode': setZipcode,
            'home-phone': setHomePhone,
            'cell-phone': setCellPhone,
            'email': setEmail
        };
        fns[name](value);
    };

    const handleSave = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(callback.current({
                street, city, state, zipcode, homePhone, cellPhone, email
            })).then(() => {
                setSuccessful(true);
            }).catch(() => {
                setSuccessful(false);
            });
        }
    };

    return (
        <>
            {successful && (<Redirect to={redirect} />)}
            <div className="col-md-12">
                <div className="card card-container--large">
                    <div className="card-body">

                        <Form onSubmit={handleSave} ref={form}>
                            {!successful && (
                                <div>
                                    <h4>{title}</h4>

                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <label htmlFor="street">Street</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="street"
                                                value={street}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="city">City</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={city}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="state">State</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={state}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="zipcode">Zipcode</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="zipcode"
                                                value={zipcode}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="home-phone">Home Phone</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="home-phone"
                                                value={homePhone}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="cell-phone">Cell Phone <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="cell-phone"
                                                value={cellPhone}
                                                onChange={onChangeField}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <label htmlFor="email">Email</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                value={email}
                                                onChange={onChangeField}
                                                validations={[required, validEmail]}
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersonForm;