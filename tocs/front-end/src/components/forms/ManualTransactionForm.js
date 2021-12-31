import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import { addManualTransaction } from "../../actions/accounting.action";
import AccountingService from "../../services/accounting.service";

import {
  required,
  OptionalField,
  formatPersonNames,
} from "../../utils/utilities";
import { Card, CardBody, CardTitle } from "../Cards";

const ManualTransactionForm = ({ location: urlLocation } = {}) => {
  const form = useRef();
  const checkBtn = useRef();
  const [content, setContent] = useState({ grades: [] });

  const [personId, setPersonId] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionById, setTransactionById] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const fns = useMemo(
    () => ({
      transactionType: setTransactionType,
      transactionDate: setTransactionDate,
      transactionById: setTransactionById,
      paymentMethod: setPaymentMethod,
      checkNumber: setCheckNumber,
      amount: setAmount,
      note: setNote,
    }),
    []
  );

  useEffect(() => {
    const { personId: _personId } = queryString.parse(urlLocation.search);
    setPersonId(_personId);
    if (personId) {
      AccountingService.initializeManualTransaction(personId).then(
        (response) => {
          if (response && response.data) {
            setContent({
              isLoaded: true,
              person: response.data.person,
              parents: response.data.parents,
            });
          }
        }
      );
    }
  }, [dispatch, fns, personId, urlLocation.search]);

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
        studentId: personId,
        transactionType,
        transactionDate,
        transactionById,
        paymentMethod,
        checkNumber,
        amount,
        note,
      };
      dispatch(addManualTransaction(personId, obj))
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
      <Card size="large">
        <CardBody>
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>{`New Manual Transaction for ${formatPersonNames(
                  content.person
                )} as Student`}</CardTitle>

                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <Select
                      className="form-control"
                      name="transactionType"
                      value={transactionType}
                      onChange={onChangeField}
                      validations={[required]}
                    >
                      <option value=""></option>
                      <option value="Textbook Purchase">
                        Textbook Purchase
                      </option>
                      <option value="Other Payment">Other Payment</option>
                      <option value="Other Refund">Other Refund</option>
                    </Select>
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="transactionDate">Transaction Date</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="transactionDate"
                      value={transactionDate}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="transactionById">Transaction By</label>
                    <Select
                      className="form-control"
                      name="transactionById"
                      value={transactionById}
                      onChange={onChangeField}
                      validations={[required]}
                    >
                      <option value=""></option>
                      {content.parents &&
                        content.parents.map((p) => (
                          <option key={`p-${p.id}`} value={p.id}>
                            {formatPersonNames(p)}
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <Select
                      className="form-control"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={onChangeField}
                      validations={[required]}
                    >
                      <option value=""></option>
                      <option value="Check">Check</option>
                      <option value="Cash">Cash</option>
                    </Select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="checkNumber">
                      Check Number <OptionalField />
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="checkNumber"
                      value={checkNumber}
                      onChange={onChangeField}
                    />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    <label htmlFor="amount">Amount</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="amount"
                      value={amount}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <label htmlFor="note">
                      Note <OptionalField />
                    </label>
                    <Textarea
                      className="form-control"
                      name="note"
                      value={note}
                      onChange={onChangeField}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6 mb-3 order-first order-md-last">
                    <button className="btn btn-primary btn-block">Save</button>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to={`/registration/show-person?id=${personId}`}
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

export default ManualTransactionForm;
