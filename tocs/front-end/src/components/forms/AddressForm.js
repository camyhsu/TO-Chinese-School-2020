import React, { useState, useRef, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardTitle } from "../Cards";

import {
  required,
  validEmail,
  OptionalField,
  BiAddress,
} from "../../utils/utilities";
import {
  getPersonalAddress as spGetPersonalAddress,
  getFamilyAddress as spGetFamilyAddress,
  saveFamilyAddress as spSaveFamilyAddress,
  savePersonalAddress as spSavePersonalAddress,
  addPersonalAddress as spAddPersonalAddress,
} from "../../actions/student-parent.action";

import {
  getFamilyAddress as rgGetFamilyAddress,
  saveFamilyAddress as rgSaveFamilyAddress,
  addPersonalAddress as rgAddPersonalAddress,
  savePersonalAddress as rgSavePersonalAddress,
  getPersonalAddress as rgGetPersonalAddress,
} from "../../actions/registration.action";

const AddressForm = ({ location } = {}) => {
  const { addressId, personId, familyId, forRegistrationStaff } = useParams();
  const addressIdIsDefined = addressId !== "none";
  const personIdIsDefined = personId !== "none";
  const familyIdIsDefined = familyId !== "none";
  const form = useRef();
  const checkBtn = useRef();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [email, setEmail] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.redirect);

  const dispatch = useDispatch();

  const fns = useMemo(
    () => ({
      street: setStreet,
      city: setCity,
      state: setState,
      zipcode: setZipcode,
      homePhone: setHomePhone,
      cellPhone: setCellPhone,
      email: setEmail,
    }),
    []
  );

  useEffect(() => {
    setFormTitle(
      `${addressIdIsDefined ? "Edit" : "Add"} ${
        familyIdIsDefined ? "Family" : "Personal"
      } Address`
    );
    if (addressIdIsDefined) {
      const fn = () => {
        if (forRegistrationStaff && familyIdIsDefined) {
          return rgGetFamilyAddress(familyId);
        }
        if (familyIdIsDefined) {
          return spGetFamilyAddress(familyId);
        }
        if (forRegistrationStaff) {
          return rgGetPersonalAddress(personId);
        }
        return spGetPersonalAddress(personId);
      };
      dispatch(fn()).then((response) => {
        if (response && response.data) {
          Object.entries(response.data).forEach(
            ([key, value]) => fns[key] && fns[key](value || "")
          );
        }
      });
    }
  }, [
    addressId,
    addressIdIsDefined,
    personId,
    personIdIsDefined,
    familyId,
    familyIdIsDefined,
    forRegistrationStaff,
    fns,
    dispatch,
  ]);

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
        street,
        city,
        state,
        zipcode,
        homePhone,
        cellPhone,
        email,
      };
      const fn = () => {
        if (forRegistrationStaff && familyIdIsDefined) {
          return rgSaveFamilyAddress(familyId, obj);
        }
        if (addressIdIsDefined) {
          if (familyIdIsDefined) {
            return spSaveFamilyAddress(familyId, obj);
          }
          if (forRegistrationStaff) {
            return rgSavePersonalAddress(personId, obj);
          }
          return spSavePersonalAddress(personId, obj);
        }
        if (forRegistrationStaff) {
          return rgAddPersonalAddress(personId, obj);
        }
        return spAddPersonalAddress(personId, obj);
      };
      dispatch(fn())
        .then(() => {
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
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>
                  <BiAddress /> {formTitle}
                </CardTitle>

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
                    <label htmlFor="cellPhone">
                      Cell Phone <OptionalField />
                    </label>
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

export default AddressForm;
