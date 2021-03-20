import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { register } from "../actions/auth.action";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vrepassword = (value, _props, components) => {
  if (value !== components['password'][0].value) {
    return (
      <div className="alert alert-danger" role="alert">
        The passwords does not match.
      </div>
    );
  }
};

const Register = () => {
  useEffect(() => { document.title = "TOCS - Register"; }, []);

  const form = useRef();
  const checkBtn = useRef();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [chineseName, setChineseName] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [gender, setGender] = useState('F');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();
  
  const onChangeField = (e) => {
    const { name, value } = e.target;
    const fns = {
      'last-name': setLastName,
      'first-name': setFirstName,
      'chinese-name': setChineseName,
      'native-language': setNativeLanguage,
      'gender': setGender,
      'birth-year': setBirthYear,
      'birth-month': setBirthMonth,
      'street': setStreet,
      'city': setCity,
      'state': setState,
      'zip': setZip,
      'home-phone': setHomePhone,
      'cell-phone': setCellPhone,
      'email': setEmail,
      'username': setUsername,
      'password': setPassword,
      'repassword': setRePassword
    };
    fns[name](value);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register({
        lastName, firstName, chineseName, nativeLanguage, gender, 
        birthYear, birthMonth, street, city, state, zip, homePhone, 
        cellPhone, email, username, password
      })).then(() => {
          setSuccessful(true);
      }).catch(() => {
        setSuccessful(false);
      });
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container--large">
        <div className="card-body">
        <img
          src="transparent-tree.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <h4>Parent One</h4>

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

              <h4 className="mt-4">Family Address</h4>

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
                  <label htmlFor="zip">Zipcode</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="zip"
                    value={zip}
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

              <h4 className="mt-4">Create Account</h4>
              
              <div className="row">
                <div className="form-group col-md-12 mb-3">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeField}
                    validations={[required, vusername]}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangeField}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="repassword">Re-type Password</label>
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
                  <button className="btn btn-primary btn-block">Create User</button>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        </div>
        <div className="card-footer">
            Back to <Link to={"/login"}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;