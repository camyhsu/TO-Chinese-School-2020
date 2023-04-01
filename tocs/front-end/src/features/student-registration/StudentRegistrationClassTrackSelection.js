import React, { useEffect } from "react";

import { Card, CardBody, CardTitle } from "../../components/Cards";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export const StudentRegistrationClassTrackSelection = () => {
  const { schoolYearId } = useParams();

  const navigate = useNavigate();

  const { handleSubmit, register } = useForm();

  useEffect(() => {
    document.title = "TOCS - Select Class Track";
  }, []);

  const submitHandler = (data) => {
    if (data.classTrack === "ec") {
      navigate(`/student/registration/language-class-ec/${schoolYearId}`);
    } else {
      navigate(`/student/registration/language-class-regular/${schoolYearId}`);
    }
  };

  return (
    <Card size="large">
      <CardBody>
        <form onSubmit={handleSubmit(submitHandler)}>
          <CardTitle className="col-md-12 mb-5">
            Select desired Class Track for your students
          </CardTitle>
          <div className="row">
            <p className="col-md-12">
              There was no Class Track records for your family in the previous
              school year. Please select the desired Class Track for your
              students.
            </p>
          </div>
          <div className="row">
            <div className="form-check col-md-12">
              <input
                {...register("classTrack", { required: true })}
                type="radio"
                id="regular"
                value="regular"
                className="form-check-input"
                checked
              />
              <label htmlFor="regular" className="form-check-label">
                Regular Language Classes
              </label>
            </div>
          </div>
          <div className="row">
            <div className="form-check col-md-12 mb-3">
              <input
                {...register("classTrack", { required: true })}
                type="radio"
                id="ec"
                value="ec"
                className="form-check-input"
              />
              <label htmlFor="ec" className="form-check-label">
                Everyday Chinese Classes
              </label>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6 mb-3">
              <button className="btn btn-primary btn-block">
                <span>Next</span>
              </button>
            </div>
            <div className="form-group col-md-6 mb-3">
              <Link to="/home" className="btn btn-primary btn-block">
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
