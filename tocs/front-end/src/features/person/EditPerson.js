/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useParams } from "react-router-dom";

import { Card, CardBody, CardTitle } from "../../components/Cards";
import {
  BiPerson,
  OptionalFieldMark,
  ProgressSpinner,
} from "../../components/decorationElements";
import {
  birthYearValidation,
  trimAndRequired,
  trimOnly,
} from "../../utils/formFieldOptions";
import {
  getPersonRequest,
  GetPersonStatus,
  updatePersonRequest,
  UpdatePersonStatus,
} from "./personApiClient";

export const EditPerson = () => {
  const { personId } = useParams();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const [getPersonStatus, setGetPersonStatus] = useState(GetPersonStatus.IDLE);
  const [updatePersonStatus, setUpdatePersonStatus] = useState(
    UpdatePersonStatus.IDLE
  );

  useEffect(() => {
    document.title = "TOCS - Edit Parent Details";
  }, []);

  useEffect(() => {
    const getPersonData = async () => {
      setGetPersonStatus(GetPersonStatus.PENDING);
      const responseFromGetPersonRequest = await getPersonRequest(personId);
      console.log(
        `responseFromGetPersonRequest => ${JSON.stringify(
          responseFromGetPersonRequest
        )}`
      );
      if (responseFromGetPersonRequest.status === GetPersonStatus.SUCCESSFUL) {
        // Set the form values to the data from the server
        reset(responseFromGetPersonRequest.data);
      }
      setGetPersonStatus(responseFromGetPersonRequest.status);
    };
    if (getPersonStatus === GetPersonStatus.IDLE) {
      console.log("GetPersonStatus is IDLE - calling the server");
      getPersonData(personId);
    }
  }, [personId]);

  const submitHandler = async (data) => {
    console.log(`In EditPerson submit handler => ${JSON.stringify(data)}`);
    setUpdatePersonStatus(UpdatePersonStatus.PENDING);
    const responseFromUpdatePersonRequest = await updatePersonRequest(
      personId,
      data
    );
    setUpdatePersonStatus(responseFromUpdatePersonRequest);
  };

  if (updatePersonStatus === UpdatePersonStatus.SUCCESSFUL) {
    return <Navigate to="/home" />;
  }

  let operationErrorMessage = null;
  if (
    getPersonStatus === GetPersonStatus.NOT_AUTHORIZED ||
    updatePersonStatus === UpdatePersonStatus.NOT_AUTHORIZED
  ) {
    operationErrorMessage = "Operation not authorized!!";
  } else if (getPersonStatus === GetPersonStatus.FAILED) {
    operationErrorMessage =
      "Problems getting current parent data - please try again later";
  } else if (updatePersonStatus === UpdatePersonStatus.FAILED) {
    operationErrorMessage =
      "Problems updating parent data - please try again later";
  }

  return (
    <Card size="large">
      <CardBody>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <CardTitle>
              <BiPerson /> Edit Parent Details
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
                <label htmlFor="birthMonth">
                  Birth Month <OptionalFieldMark />
                </label>
                <select {...register("birthMonth")} className="form-control">
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
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="birthYear">
                  Birth Year <OptionalFieldMark />
                </label>
                <input
                  {...register("birthYear", birthYearValidation)}
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
                  {updatePersonStatus === UpdatePersonStatus.PENDING && (
                    <ProgressSpinner />
                  )}
                  <span>Save</span>
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
