import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useParams } from "react-router-dom";

import { Card, CardBody, CardTitle } from "../../components/Cards";

import {
  requiredOnly,
  studentBirthYearValidation,
  trimAndRequired,
  trimOnly,
} from "../../utils/formFieldOptions";
import { addPersonRequest, AddPersonStatus } from "./personApiClient";
import {
  BiPerson,
  OptionalFieldMark,
  ProgressSpinner,
} from "../../components/decorationElements";

export const AddPerson = () => {
  const { familyId } = useParams();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [addPersonStatus, setAddPersonStatus] = useState(AddPersonStatus.IDLE);

  useEffect(() => {
    document.title = "TOCS - Add Student";
  }, []);

  const submitHandler = async (data) => {
    console.log(JSON.stringify(data));
    setAddPersonStatus(AddPersonStatus.PENDING);
    const responseFromAddPersonRequest = await addPersonRequest(familyId, data);
    setAddPersonStatus(responseFromAddPersonRequest);
  };

  if (addPersonStatus === AddPersonStatus.SUCCESSFUL) {
    return <Navigate to="/home" />;
  }

  let operationErrorMessage = null;
  if (addPersonStatus === AddPersonStatus.NOT_AUTHORIZED) {
    operationErrorMessage = "Operation not authorized!!";
  } else if (addPersonStatus === AddPersonStatus.FAILED) {
    operationErrorMessage =
      "Problems getting adding the student - please try again later";
  }

  return (
    <Card size="large">
      <CardBody>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <CardTitle>
              <BiPerson /> Add Student
            </CardTitle>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="firstName">English First Name</label>
                <input
                  {...register("firstName", trimAndRequired)}
                  type="text"
                  placeholder="First Name"
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="lastName">English Last Name</label>
                <input
                  {...register("lastName", trimAndRequired)}
                  type="text"
                  placeholder="Last Name"
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="chineseName">
                  Chinese Name <OptionalFieldMark />
                </label>
                <input
                  {...register("chineseName", trimOnly)}
                  type="text"
                  placeholder="中文姓名"
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="nativeLanguage">Native Language</label>
                <select
                  {...register("nativeLanguage")}
                  className="form-control"
                >
                  <option value="Mandarin">Mandarin</option>
                  <option value="English">English</option>
                  <option value="Cantonese">Cantonese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="gender">Gender</label>
                <select {...register("gender")} className="form-control">
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="birthMonth">Birth Month</label>
                <select
                  {...register("birthMonth", requiredOnly)}
                  className={`form-control ${
                    errors.birthMonth ? "is-invalid" : ""
                  }`}
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
                </select>
                <div className="invalid-feedback">
                  {errors.birthMonth?.message}
                </div>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="birthYear">Birth Year</label>
                <input
                  {...register("birthYear", studentBirthYearValidation)}
                  type="number"
                  placeholder="YYYY"
                  className={`form-control ${
                    errors.birthYear ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.birthYear?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mt-5 mb-3">
                <button className="btn btn-primary btn-block">
                  {addPersonStatus === AddPersonStatus.PENDING && (
                    <ProgressSpinner />
                  )}
                  <span>Add</span>
                </button>
              </div>
              <div className="form-group col-md-6 mt-5 mb-3">
                <Link to="/home" className="btn btn-primary btn-block">
                  <span>Cancel</span>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                {operationErrorMessage && (
                  <div className="alert alert-danger" role="alert-error">
                    {operationErrorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
