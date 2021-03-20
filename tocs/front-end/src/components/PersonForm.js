import React, { useState, useRef, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const PersonForm = ({ location } = {}) => {
    const form = useRef();
    const checkBtn = useRef();

    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [chineseName, setChineseName] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('Mandarin');
    const [gender, setGender] = useState('F');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [title, setTitle] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);

    const callback = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const { params } = location;
        const fn = (v, setter) => v && setter(v);
        fn(params.lastName, setLastName);
        fn(params.firstName, setFirstName)
        fn(params.chineseName, setChineseName)
        fn(params.nativeLanguage, setNativeLanguage)
        fn(params.gender, setGender)
        fn(params.birthYear, setBirthYear)
        fn(params.birthMonth, setBirthMonth)

        setTitle(params.title);
        callback.current = params.callback;
    }, [location]);

    const onChangeField = (e) => {
        const { name, value } = e.target;
        const fns = {
            'last-name': setLastName,
            'first-name': setFirstName,
            'chinese-name': setChineseName,
            'native-language': setNativeLanguage,
            'gender': setGender,
            'birth-year': setBirthYear,
            'birth-month': setBirthMonth
        };
        fns[name](value);
    };

    const handleSave = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(callback.current({
                lastName, firstName, chineseName, nativeLanguage, gender,
                birthYear, birthMonth
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
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="last-name">English Last Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="last-name"
                                                value={lastName}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="first-name">English First Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="first-name"
                                                value={firstName}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="chinese-name">Chinese Name <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="chinese-name"
                                                value={chineseName}
                                                onChange={onChangeField}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="native-language">Native Language <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Select
                                                className="form-control"
                                                name="native-language"
                                                value={nativeLanguage}
                                                onChange={onChangeField}>
                                                <option value='Mandarin'>Mandarin</option>
                                                <option value='English'>English</option>
                                                <option value='Cantonese'>Cantonese</option>
                                                <option value='Other'>Other</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="gender">Gender</label>
                                            <Select
                                                className="form-control"
                                                name="gender"
                                                value={gender}
                                                onChange={onChangeField}
                                                validations={[required]}>
                                                <option value='F'>F</option>
                                                <option value='M'>M</option>
                                            </Select>
                                        </div>

                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="birth-year">Birth Year <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="birth-year"
                                                value={birthYear}
                                                onChange={onChangeField}
                                            />
                                        </div>

                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="birth-month">Birth Month <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Select
                                                className="form-control"
                                                name="birth-month"
                                                value={birthMonth}
                                                onChange={onChangeField}>
                                                <option value=''></option>
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