import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import { Card, CardBody } from "../Cards";

import { required, validEmail } from '../../utils/utilities';
import {
    getPersonalAddress, getFamilyAddress, saveFamilyAddress, savePersonalAddress, addPersonalAddress
} from '../../actions/student-parent.action';

const PersonForm = ({ location } = {}) => {
    const form = useRef();
    const checkBtn = useRef();

    const [personId, setPersonId] = useState(null);
    const [familyId, setFamilyId] = useState(null);
    const [id, setId] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');

    const [formTitle, setFormTitle] = useState('');
    const [successful, setSuccessful] = useState(false);

    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);

    const dispatch = useDispatch();

    const fns = useMemo(() => ({
        'id': setId,
        'street': setStreet,
        'city': setCity,
        'state': setState,
        'zipcode': setZipcode,
        'homePhone': setHomePhone,
        'cellPhone': setCellPhone,
        'email': setEmail
    }), []);

    useEffect(() => {
        const { id, personId, familyId } = queryString.parse(location.search);
        setFormTitle(`${id ? 'Edit' : 'Add'} ${familyId ? 'Family' : 'Personal'} Address`);
        setPersonId(personId);
        setFamilyId(familyId);
        if (id) {
            dispatch(familyId ? getFamilyAddress(familyId) : getPersonalAddress(personId)).then((response) => {
                if (response && response.data) {
                    Object.entries(response.data).forEach(([key, value]) => fns[key] && fns[key](value || ''));
                }
            });
        }
    }, [location, fns, dispatch]);

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
                street, city, state, zipcode, homePhone, cellPhone, email
            };
            dispatch(
                id ? 
                (familyId ? saveFamilyAddress(familyId, obj) : savePersonalAddress(personId, obj))
                : addPersonalAddress(personId, obj)
            ).then(() => {
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
                                    <h4>{formTitle}</h4>

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
                                            <label htmlFor="homePhone">Home Phone</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="homePhone"
                                                value={homePhone}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group col-md-6 mb-3">
                                            <label htmlFor="cellPhone">Cell Phone <span className="text-muted"><small>(Optional)</small></span></label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="cellPhone"
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
                    </CardBody>
            </Card>
        </>
    );
};

export default PersonForm;