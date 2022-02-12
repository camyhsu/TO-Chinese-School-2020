import React, { useState, useRef, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardTitle } from "../Cards";

import { required, OptionalField } from "../../utils/utilities";
import {
  addLibraryBook,
  saveLibraryBook,
  getLibraryBook,
} from "../../actions/librarian.action";

const BookForm = () => {
  const { bookId } = useParams();
  const bookIdIsDefined = bookId !== "new";
  const form = useRef();
  const checkBtn = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [bookType, setBookType] = useState("S");
  const [note, setNote] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const fns = useMemo(
    () => ({
      title: setTitle,
      description: setDescription,
      publisher: setPublisher,
      bookType: setBookType,
      note: setNote,
    }),
    []
  );

  useEffect(() => {
    setFormTitle(`${bookIdIsDefined ? "Edit" : "Add"} Book`);
    if (bookIdIsDefined) {
      dispatch(getLibraryBook(bookId)).then((response) => {
        if (response && response.data) {
          Object.entries(response.data).forEach(
            ([key, value]) => fns[key] && fns[key](value || "")
          );
        }
      });
    }
  }, [bookId, fns, dispatch, bookIdIsDefined]);

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
        title,
        description,
        publisher,
        bookType,
        note,
      };
      dispatch(
        bookIdIsDefined ? saveLibraryBook(bookId, obj) : addLibraryBook(obj)
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
      <Card size="medium">
        <CardBody>
          <Form onSubmit={handleSave} ref={form}>
            {!successful && (
              <div>
                <CardTitle>{formTitle}</CardTitle>

                <div className="row">
                  <div className="form-group col-md-12 mb-3">
                    <label htmlFor="title">Title</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="title"
                      value={title}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12 mb-3">
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
                  <div className="form-group col-md-9 mb-3">
                    <label htmlFor="publisher">Publisher</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="publisher"
                      value={publisher}
                      onChange={onChangeField}
                      validations={[required]}
                    />
                  </div>

                  <div className="form-group col-md-3 mb-3">
                    <label htmlFor="bookType">BookType</label>
                    <Select
                      className="form-control"
                      name="bookType"
                      value={bookType}
                      onChange={onChangeField}
                    >
                      <option value="S">S</option>
                      <option value="T">T</option>
                      <option value="S/T">S/T</option>
                    </Select>
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

export default BookForm;
