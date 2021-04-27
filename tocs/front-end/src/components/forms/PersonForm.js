import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import { required, OptionalField } from '../../utils/utilities';
import {
    getPersonalDetails, savePersonalDetails, addParent as spAddParent, addChild as spAddChild
} from '../../actions/student-parent.action';
import {
    addChild as rgAddChild, addParent as rgAddParent
} from '../../actions/registration.action';
import { Card, CardBody, CardTitle } from "../Cards";

const PersonForm = ({ location } = {}) => {
    const form = useRef();
    const checkBtn = useRef();

    const [familyId, setFamilyId] = useState(null);
    const [registration,  setRegistration] = useState(null);
    const [isParentTwo, setIsParentTwo] = useState(false);
    const [id, setId] = useState(null);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [chineseName, setChineseName] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('Mandarin');
    const [gender, setGender] = useState('F');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);

    const dispatch = useDispatch();

    const fns = useMemo(() => ({
        'id': setId,
        'lastName': setLastName,
        'firstName': setFirstName,
        'chineseName': setChineseName,
        'nativeLanguage': setNativeLanguage,
        'gender': setGender,
        'birthYear': setBirthYear,
        'birthMonth': setBirthMonth
    }), []);

    useEffect(() => {
        const { id, familyId, isParentTwo, registration } = queryString.parse(location.search);
        if (id) {
            setFormTitle(`Edit ${familyId ? 'Family' : 'Personal'} Details`);
        } else {
            setFormTitle(`Add ${isParentTwo ? 'Parent' : 'Child'}`);
        }
        
        setFamilyId(familyId);
        setIsParentTwo(!!isParentTwo);
        setRegistration(registration);
        if (id) {
            dispatch(getPersonalDetails(id)).then((response) => {
                if (response && response.data) {
                    Object.entries(response.data).forEach(([key, value]) => fns[key] && fns[key](value || ''));
                }
            });
        }
    }, [location.search, dispatch, fns]);

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
                lastName, firstName, chineseName, nativeLanguage, gender,
                birthYear, birthMonth
            };
            const fn = () => {
                if (registration && familyId) {
                    if (isParentTwo) {
                        return rgAddParent(familyId, obj);
                    }
                    return rgAddChild(familyId, obj);
                }
                if (id) {
                    return savePersonalDetails(id, obj);
                }
                if (isParentTwo) {
                    return spAddParent(familyId, obj);
                }
                return spAddChild(familyId, obj);
            };
            dispatch(fn()).then(() => {
                setSuccessful(true);
            }).catch(() => {
                setSuccessful(false);
            });
        }
    };

    return (
        <>
            {successful && (<Redirect to={redirect} />)}
            <Card size="large">
                    <CardBody>

                        <Form onSubmit={handleSave} ref={form}>
                            {!successful && (
                                <div>
                                    <CardTitle>{formTitle}</CardTitle>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="lastName">English Last Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                value={lastName}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="firstName">English First Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                value={firstName}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="chineseName">Chinese Name <OptionalField/></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="chineseName"
                                                value={chineseName}
                                                onChange={onChangeField}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="nativeLanguage">Native Language <OptionalField/></label>
                                            <Select
                                                className="form-control"
                                                name="nativeLanguage"
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
                                            <label htmlFor="birthYear">Birth Year <OptionalField/></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="birthYear"
                                                value={birthYear}
                                                onChange={onChangeField}
                                            />
                                        </div>

                                        <div className="form-group col-md-4 mb-3">
                                            <label htmlFor="birthMonth">Birth Month <OptionalField/></label>
                                            <Select
                                                className="form-control"
                                                name="birthMonth"
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
                    </CardBody>
            </Card>
        </>
    );
};

export default PersonForm;