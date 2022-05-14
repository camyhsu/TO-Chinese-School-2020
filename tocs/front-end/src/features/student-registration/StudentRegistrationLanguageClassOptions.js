import React, { useEffect } from "react";

import { Card, CardBody, CardTitle } from "../../components/Cards";
import { Link, Navigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export const StudentRegistrationLanguageClassOptions = ({
  classTrackDefault,
}) => {
  const { schoolYearId } = useParams();

  const { handleSubmit, register } = useForm();

  useEffect(() => {
    document.title = "TOCS - Select Language Class Options";
  }, []);

  const submitHandler = async (data) => {
    console.log(data);
  };

  return (
    <Card size="large">
      <CardBody>
        <CardTitle className="col-md-12 mb-5">
          Select desired Language Classes for your students
        </CardTitle>
        <div className="row">
          <p className="col-md-12">
            Default Class Track is {classTrackDefault}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
