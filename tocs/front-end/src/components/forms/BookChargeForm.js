import React, { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardTitle } from "../Cards";

import {
  requiredZeroAccepted,
  decimal,
  bilingualName,
} from "../../utils/utilities";
import {
  getBookCharges,
  saveBookCharges,
} from "../../actions/registration.action";

const BookChargeForm = ({ location } = {}) => {
  const form = useRef();
  const checkBtn = useRef();

  const [schoolYearId, setSchoolYearId] = useState(null);
  const [bookCharges, setBookCharges] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const { schoolYearId } = queryString.parse(location.search);
    setSchoolYearId(schoolYearId);
    setFormTitle("Edit Book / Material Charge");
    if (schoolYearId) {
      dispatch(getBookCharges(schoolYearId)).then((response) => {
        if (response && response.data) {
          const _bookCharges = response.data;
          if (_bookCharges && _bookCharges.length) {
            const obj = _bookCharges.reduce(
              (result, current) =>
                Object.assign(result, { [current.id]: current }),
              {}
            );
            setBookCharges(obj);
            setSubTitle(`For School Year ${_bookCharges[0].schoolYear.name}`);
          }
        }
      });
    }
  }, [location.search, dispatch]);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    bookCharges[name].bookCharge = value;
  };

  const handleSave = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      const obj = Object.entries(bookCharges).reduce(
        (result, [key, value]) =>
          Object.assign(result, { [key]: value.bookCharge }),
        {}
      );
      dispatch(saveBookCharges(schoolYearId, obj))
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
      {successful && <Redirect to={redirect} />}
      <Card size="medium">
        <CardBody>
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>{formTitle}</CardTitle>
                <CardTitle>{subTitle}</CardTitle>
                {bookCharges &&
                  Object.entries(bookCharges).map(([key, value]) => {
                    return (
                      <React.Fragment key={"row-" + key}>
                        <div className="row form-group mb-3">
                          <div className="col-12 col-md-6 text-md-right">
                            <label htmlFor={`book-charge-${key}`}>
                              {bilingualName(value.grade)}
                            </label>
                          </div>
                          <div className="col-12 col-md-6">
                            <Input
                              type="text"
                              className="form-control"
                              name={key}
                              value={decimal(value.bookCharge)}
                              onChange={onChangeField}
                              validations={[requiredZeroAccepted]}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

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

export default BookChargeForm;
