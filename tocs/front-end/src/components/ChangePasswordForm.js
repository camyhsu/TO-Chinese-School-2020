import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { required, vpassword, vrepassword } from '../utils/utilities';
import { Card, CardBody, CardTitle } from "./Cards";
import { changePassword } from "../actions/user.action";

const ChangePasswordForm = () => {
    const form = useRef();
    const checkBtn = useRef();
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [successful, setSuccessful] = useState(false);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    const fns = {
      'currentPassword': setCurrentPassword,
      'password': setPassword,
      'repassword': setRePassword
    };
    fns[name](value);
  };

    const handleSave = (e) => {
        e.preventDefault();

        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            dispatch(changePassword({
                currentPassword, newPassword: password, newPasswordConfirmation: repassword
            })).then(() => {
                setSuccessful(true);
            }).catch(() => {
                setSuccessful(false);
            });
        }
    };
    return (
        <>
            {successful && false && (<Redirect to='/account' />)}
            <Card>
                    <CardBody>

                        <Form onSubmit={handleSave} ref={form}>
                            {!successful && (
                                <div>
                                    <CardTitle>Change Password</CardTitle>

                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <label htmlFor="password">Current Password</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="currentPassword"
                                                value={currentPassword}
                                                onChange={onChangeField}
                                                validations={[required]}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <label htmlFor="password">New Password</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={password}
                                                onChange={onChangeField}
                                                validations={[required, vpassword]}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-12 mb-3">
                                            <label htmlFor="repassword">Re-type New Password</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="repassword"
                                                value={repassword}
                                                onChange={onChangeField}
                                                validations={[required, vrepassword]}
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
        </>);
};

export default ChangePasswordForm;