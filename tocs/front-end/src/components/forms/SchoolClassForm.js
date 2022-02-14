import React, { useState, useRef, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import {
  addSchoolClass,
  saveSchoolClass,
  getSchoolClass,
} from "../../actions/registration.action";
import RegistrationService from "../../services/registration.service";

import { required, OptionalField } from "../../utils/utilities";
import { Card, CardBody, CardTitle } from "../Cards";

const SchoolClassForm = () => {
  const { schoolClassId } = useParams();
  const schoolClassIdIsDefined = schoolClassId !== "new";
  const form = useRef();
  const checkBtn = useRef();
  const [content, setContent] = useState({ grades: [] });

  const [englishName, setEnglishName] = useState("");
  const [chineseName, setChineseName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [schoolClassType, setSchoolClassType] = useState("");
  const [maxSize, setMaxSize] = useState(25);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [gradeId, setGradeId] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.redirect);

  const dispatch = useDispatch();

  const fns = useMemo(
    () => ({
      englishName: setEnglishName,
      chineseName: setChineseName,
      shortName: setShortName,
      description: setDescription,
      location: setLocation,
      schoolClassType: setSchoolClassType,
      maxSize: setMaxSize,
      minAge: setMinAge,
      maxAge: setMaxAge,
      gradeId: setGradeId,
    }),
    []
  );

  useEffect(() => {
    setFormTitle(`${schoolClassIdIsDefined ? "Edit" : "Add"} School Class`);
    RegistrationService.getGrades().then((response) => {
      const grades = response.data;
      setContent({ grades });
    });
    if (schoolClassIdIsDefined) {
      dispatch(getSchoolClass(schoolClassId)).then((response) => {
        if (response && response.data) {
          Object.entries(response.data).forEach(
            ([key, value]) => fns[key] && fns[key](value || "")
          );
        }
      });
    }
  }, [dispatch, fns, schoolClassId, schoolClassIdIsDefined]);

  const grades = content.grades;

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
        englishName,
        chineseName,
        shortName,
        description,
        location,
        schoolClassType,
        maxSize,
        minAge,
        maxAge,
        gradeId,
      };
      dispatch(
        schoolClassIdIsDefined
          ? saveSchoolClass(schoolClassId, obj)
          : addSchoolClass(obj)
      )
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
      <Card size="xlarge">
        <CardBody>
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>{formTitle}</CardTitle>

                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="englishName">English Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="englishName"
                      value={englishName}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="chineseName">Chinese Name</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="chineseName"
                      value={chineseName}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="shortName">
                      Short Name <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="shortName"
                      value={shortName}
                      onChange={onChangeField}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="description">
                      Description <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="description"
                      value={description}
                      onChange={onChangeField}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="location">
                      Location <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="location"
                      value={location}
                      onChange={onChangeField}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="schoolClassType">
                      Type <OptionalField />
                    </label>
                    <Select
                      className="form-control"
                      name="schoolClassType"
                      value={schoolClassType}
                      onChange={onChangeField}
                    >
                      <option value=""></option>
                      <option value="ELECTIVE">ELECTIVE</option>
                      <option value="SE">SE</option>
                      <option value="M">M</option>
                      <option value="S">S</option>
                      <option value="T">T</option>
                      <option value="EC">EC</option>
                    </Select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="maxSize">Max Size</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="maxSize"
                      value={maxSize}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="type">
                      Grade <OptionalField />
                    </label>
                    <Select
                      className="form-control"
                      name="gradeId"
                      value={gradeId}
                      onChange={onChangeField}
                    >
                      <option value=""></option>
                      {grades.map((g) => (
                        <option key={`g-${g.id}`} value={g.id}>
                          {g.chineseName}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="minAge">
                      Min Age <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="minAge"
                      value={minAge}
                      onChange={onChangeField}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="maxAge">
                      Max Age <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="maxAge"
                      value={maxAge}
                      onChange={onChangeField}
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

export default SchoolClassForm;
