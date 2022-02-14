import React, { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardTitle } from "../Cards";
import { required, validEmail, OptionalField } from "../../utils/utilities";
import { addNewFamily } from "../../actions/registration.action";

const NewFamilyForm = () => {
  useEffect(() => {
    document.title = "TOCS";
  }, []);

  const form = useRef();
  const checkBtn = useRef();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [chineseName, setChineseName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [gender, setGender] = useState("F");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [email, setEmail] = useState("");

  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.redirect);
  const dispatch = useDispatch();

  const onChangeField = (e) => {
    const { name, value } = e.target;
    const fns = {
      "last-name": setLastName,
      "first-name": setFirstName,
      "chinese-name": setChineseName,
      "native-language": setNativeLanguage,
      gender: setGender,
      "birth-year": setBirthYear,
      "birth-month": setBirthMonth,
      street: setStreet,
      city: setCity,
      state: setState,
      zipcode: setZipcode,
      "home-phone": setHomePhone,
      "cell-phone": setCellPhone,
      email: setEmail,
    };
    fns[name](value);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(
        addNewFamily({
          lastName,
          firstName,
          chineseName,
          nativeLanguage,
          gender,
          birthYear,
          birthMonth,
          street,
          city,
          state,
          zipcode,
          homePhone,
          cellPhone,
          email,
        })
      )
        .then((r) => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  return (
    <>
      {successful && <Navigate to={redirect} />}
      <Card size="large">
        <CardBody>
          <Form onSubmit={handleRegister} ref={form}>
            {!successful && (
              <div>
                <CardTitle hSize="4" clazz="mt-2">
                  New Family
                </CardTitle>
                <CardTitle clazz="mt-4">Family Address</CardTitle>

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
                    <label htmlFor="cell-phone">
                      Cell Phone <OptionalField />
                    </label>
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

                <CardTitle clazz="mt-4">Parent One of the family</CardTitle>

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
                    <label htmlFor="chinese-name">
                      Chinese Name <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="chinese-name"
                      value={chineseName}
                      onChange={onChangeField}
                    />
                  </div>

                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="native-language">
                      Native Language <OptionalField />
                    </label>
                    <Select
                      className="form-control"
                      name="native-language"
                      value={nativeLanguage}
                      onChange={onChangeField}
                    >
                      <option value="Mandarin">Mandarin</option>
                      <option value="English">English</option>
                      <option value="Cantonese">Cantonese</option>
                      <option value="Other">Other</option>
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
                      validations={[required]}
                    >
                      <option value="F">F</option>
                      <option value="M">M</option>
                    </Select>
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <label htmlFor="birth-year">
                      Birth Year <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="birth-year"
                      value={birthYear}
                      onChange={onChangeField}
                    />
                  </div>

                  <div className="form-group col-md-4 mb-3">
                    <label htmlFor="birth-month">
                      Birth Month <OptionalField />
                    </label>
                    <Select
                      className="form-control"
                      name="birth-month"
                      value={birthMonth}
                      onChange={onChangeField}
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </Select>
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <button className="btn btn-primary btn-block">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
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

export default NewFamilyForm;
