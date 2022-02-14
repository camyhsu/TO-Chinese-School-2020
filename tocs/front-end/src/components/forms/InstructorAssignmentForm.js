import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardTitle } from "../Cards";

import { required, OptionalField } from "../../utils/utilities";
import {
  addInstructorAssignment,
  saveInstructorAssignment,
} from "../../actions/registration.action";
import RegistrationService from "../../services/registration.service";

const InstructorAssignmentForm = () => {
  const { personId, instructorAssignmentId } = useParams();
  const instructorAssignmentIdIsDefined = instructorAssignmentId !== "new";
  const form = useRef();
  const checkBtn = useRef();

  const [schoolYearId, setSchoolYearId] = useState("");
  const [schoolClassId, setSchoolClassId] = useState("");
  const [role, setRole] = useState("");
  const [schoolYears, setSchoolYears] = useState("");
  const [schoolClasses, setSchoolClasses] = useState("");
  const [roles, setRoles] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [successful, setSuccessful] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.redirect);

  const dispatch = useDispatch();
  const fns = useMemo(
    () => ({
      schoolYearId: setSchoolYearId,
      schoolClassId: setSchoolClassId,
      startDate: setStartDate,
      endDate: setEndDate,
      role: setRole,
    }),
    []
  );

  useEffect(() => {
    if (personId) {
      RegistrationService.getInstructorAssignmentForm(
        instructorAssignmentId
      ).then((response) => {
        if (response && response.data) {
          setSchoolYears(response.data.schoolYears);
          setSchoolClasses(response.data.schoolClasses);
          setRoles(response.data.roles);

          setSchoolYearId(response.data.schoolYears[0].id);
          setSchoolClassId(response.data.schoolClasses[0].id);
          setRole(response.data.roles[0]);

          if (
            instructorAssignmentIdIsDefined &&
            response.data.instructorAssignment
          ) {
            Object.entries(response.data.instructorAssignment).forEach(
              ([key, value]) => fns[key] && fns[key](value || "")
            );
          }
        }
      });
    }
  }, [
    dispatch,
    personId,
    instructorAssignmentId,
    instructorAssignmentIdIsDefined,
    fns,
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
        schoolYearId,
        schoolClassId,
        role,
        startDate,
        endDate,
      };
      const fn = () => {
        if (instructorAssignmentIdIsDefined) {
          return saveInstructorAssignment(
            instructorAssignmentId,
            obj,
            personId
          );
        }
        return addInstructorAssignment(personId, obj);
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
      <Card size="medium">
        <CardBody>
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>Add Instructor Assignment</CardTitle>
                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <label htmlFor="schoolYearId">School Year</label>
                    {schoolYears && (
                      <Select
                        className="form-control"
                        name="schoolYearId"
                        value={schoolYearId}
                        onChange={onChangeField}
                        validations={[required]}
                      >
                        {schoolYears.map((s) => (
                          <option key={`sy-${s.id}`} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <label htmlFor="schoolClassId">School Class</label>
                    {schoolClasses && (
                      <Select
                        className="form-control"
                        name="schoolClassId"
                        value={schoolClassId}
                        onChange={onChangeField}
                        validations={[required]}
                      >
                        {schoolClasses.map((s) => (
                          <option key={`sc-${s.id}`} value={s.id}>
                            {s.chineseName}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="startDate">
                      Start Date <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="startDate"
                      value={startDate}
                      onChange={onChangeField}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="endDate">
                      End Date <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="endDate"
                      value={endDate}
                      onChange={onChangeField}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <label htmlFor="role">Role</label>
                    {roles && (
                      <Select
                        className="form-control"
                        name="role"
                        value={role}
                        onChange={onChangeField}
                        validations={[required]}
                      >
                        {roles.map((r, i) => (
                          <option key={`r-${i}`} value={r}>
                            {r}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-3 order-first order-md-last">
                    <button className="btn btn-primary btn-block">Save</button>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to={`/registration/show-person/${personId}`}
                      className="btn btn-light btn-block"
                    >
                      Back
                    </Link>
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

export default InstructorAssignmentForm;
