import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import Table from "../Table";
import LibrarianService from "../../services/librarian.service";
import {
  checkOutLibraryBook,
  returnLibraryBook,
} from "../../actions/librarian.action";
import {
  formatPersonNames,
  yesOrNo,
  required,
  today,
  OptionalField,
} from "../../utils/utilities";
import { Card, CardBody, CardTitle } from "../Cards";

const CheckoutHistoryForm = () => {
  const { bookId } = useParams();
  const form = useRef();
  const checkBtn = useRef();
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const { redirect } = useSelector((state) => state.user);
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });
  const [checkedOutBy, setCheckedOutBy] = useState(null);
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");

  const header = [
    { title: "Checked Out Date", prop: "checkedOutDate" },
    {
      title: "Checked Out By",
      cell: (row) => {
        return formatPersonNames(row.checkedOutBy);
      },
    },
    { title: "Return Date", prop: "returnDate" },
    { title: "Note", prop: "note" },
  ];

  const dispatch = useDispatch();
  const fns = useMemo(
    () => ({
      checkedOutBy: setCheckedOutBy,
      date: setDate,
      note: setNote,
    }),
    []
  );

  useEffect(() => {
    document.title = "TOCS - Home";
    LibrarianService.getLibraryBookCheckOutHistory(bookId).then(
      (response) => {
        const book = response.data;
        setContent({
          isLoaded: true,
          item: book,
        });
        if (
          book &&
          book.eligibleCheckoutPeople &&
          book.eligibleCheckoutPeople.length
        ) {
          setCheckedOutBy(book.eligibleCheckoutPeople[0].id);
        }
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content },
        });
      }
    );
  }, [bookId]);

  const book = content && content.item;
  const checkouts = book && book.checkOuts;
  const currentCheckout = checkouts && checkouts.find((c) => !c.returnDate);
  const eligibleCheckoutPeople = book && book.eligibleCheckoutPeople;

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
        date,
        note,
      };
      if (book.checkedOut) {
        obj.returnDate = date;
      } else {
        obj.checkedOutBy = checkedOutBy;
        obj.checkedOutDate = date;
      }
      dispatch(
        book.checkedOut
          ? returnLibraryBook(bookId, obj)
          : checkOutLibraryBook(bookId, obj)
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
      {successful && <Redirect to={redirect} />}
      {book && (
        <>
          <Card size="large">
            <CardBody>
              <CardTitle>Library Book Checkout History</CardTitle>
              <dl className="row">
                <dt className="col-12 col-md-4 text-left text-md-right">
                  Book Id:
                </dt>
                <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                  {book.id}
                </dd>
                <dt className="col-12 col-md-4 text-left text-md-right">
                  Title:
                </dt>
                <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                  {book.title}
                </dd>
                <dt className="col-12 col-md-4 text-left text-md-right">
                  Description:
                </dt>
                <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                  {book.description}
                </dd>
                <dt className="col-12 col-md-4 text-left text-md-right">
                  Book Type:
                </dt>
                <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                  {book.bookType}
                </dd>
                <dt className="col-12 col-md-4 text-left text-md-right">
                  Checked Out ?
                </dt>
                <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                  {yesOrNo(book.checkedOut)}
                </dd>
                {book.checkedOut && (
                  <>
                    <dt className="col-12 col-md-4 text-left text-md-right">
                      Checked Out By:
                    </dt>
                    <dd className="col-12 col-md-8 text-left border-bottom border-md-bottom-0">
                      {formatPersonNames(currentCheckout.checkedOutBy)}
                    </dd>
                  </>
                )}
              </dl>
              <div className="card-footer row">
                <div className="col-md-6">
                  <Link to="/librarian/books" className="btn btn-light">
                    Back to Library Books
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card size="large">
            <CardBody>
              <Form onSubmit={handleSave} ref={form}>
                {!successful && (
                  <div>
                    <CardTitle>
                      {book.checkedOut ? "Returning" : "Checking Out"} This Book
                    </CardTitle>
                    {!book.checkedOut && (
                      <div className="row">
                        <div className="form-group col-md-12 mb-3">
                          <Select
                            className="form-control"
                            name="checkedOutBy"
                            value={checkedOutBy}
                            onChange={onChangeField}
                          >
                            {eligibleCheckoutPeople.map((p) => (
                              <option key={`p-${p.id}`} value={p.id}>
                                {formatPersonNames(p)}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="form-group col-md-12 mb-3">
                        <label htmlFor="title">Date</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="date"
                          value={date}
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
                      <div className="form-group col-md-12 mb-3">
                        <button className="btn btn-primary btn-block">
                          {book.checkedOut ? "Return" : "Check Out"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {message && (
                  <div className="form-group">
                    <div
                      className={
                        successful
                          ? "alert alert-success"
                          : "alert alert-danger"
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
          <Card size="large">
            <CardBody>
              <CardTitle>Checkout History</CardTitle>
              <Table
                header={header}
                items={checkouts}
                isLoaded={content.isLoaded}
                error={content.error}
                sortKey="id"
                showAll="true"
              />
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

export default CheckoutHistoryForm;
