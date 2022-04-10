import React from "react";
import { Link } from "react-router-dom";
import { isEmail } from "validator";

const d = (s) => s || "";

const dollar = (s, inCents) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD" }).format(
    inCents ? s / 100 : s
  );

const decimal = (s) =>
  new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(s);

const formatBirthInfo = (person) =>
  person && (person.birthYear || person.birthMonth)
    ? `${person.birthMonth}/${person.birthYear}`
    : "";

const formatPersonName = (person) =>
  (person && person.firstName + " " + person.lastName) || "";

const formatPersonNames = (person) =>
  (person &&
    `${person.chineseName || ""}(${person.firstName} ${person.lastName})`) ||
  "";

const formatPersonNamesWithLink = (person) => (
  <>
    {person && (
      <Link to={"/registration/show-person/" + person.id}>
        {formatPersonNames(person)}
      </Link>
    )}
  </>
);

const formatAddress = (address) =>
  (address &&
    `${d(address.street)} ${d(address.city)}${d(address.city) && ","} ${d(
      address.state
    )} ${d(address.zipcode)}`) ||
  "";

const toNumeric = (s) => s && s.replace(/\D/g, "");

const formatPhoneNumber = (s) =>
  (s && toNumeric(s).replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")) || "";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const requiredZeroAccepted = (value) => {
  if (!value && value !== 0) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const yesOrNo = (b) => (b ? "Yes" : "No");

const today = () => new Date().toISOString().split("T")[0];

const getYear = () => new Date().getFullYear();

const BiAddress = () => <i className="bi-house-door"></i>;

const BiPerson = () => <i className="bi-person"></i>;

const BiCreditCard = () => <i className="bi-credit-card-2-front"></i>;

const BiPencil = () => <i className="bi-pencil"></i>;

const BiPlus = () => <i className="bi-plus"></i>;

const BiPersonPlus = () => <i className="bi-person-plus"></i>;

const BiClockHistory = () => <i className="bi-clock-history"></i>;

const BiInfoCircle = () => <i className="bi-info-circle"></i>;

const BiToggle = ({ on }) => (
  <i className={on ? "bi-toggle-on" : "bi-toggle-off"}></i>
);

const OptionalField = () => (
  <span className="text-muted">
    <small>(Optional)</small>
  </span>
);

const pagingDataToContent = (response, rowsPerPage) => ({
  isLoaded: true,
  items: response.data.rows,
  maxPage:
    Math.trunc(response.data.count / rowsPerPage) +
    (response.data.count % rowsPerPage === 0 ? 0 : 1),
});

const Children = ({ children = [], link } = {}) =>
  children.map((c, i) => (
    <React.Fragment key={"child-" + i}>
      {link ? formatPersonNamesWithLink(c) : formatPersonNames(c)}
      {i !== children.length - 1 ? <br /> : ""}
    </React.Fragment>
  ));

const isoToPacific = (s, dateOnly) => {
  if (dateOnly) {
    return new Date(s).toLocaleString("fr-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
  return new Date(s).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
};

const labelForTuitionDiscountApplied = (studentFeePayment) => {
  if (studentFeePayment.staffDiscount) {
    return " (Staff Discount Applied)";
  }
  if (studentFeePayment.instructorDiscount) {
    return " (Instructor Discount Applied)";
  }
  return "";
};

const bilingualName = (obj) =>
  (obj && `${obj.chineseName}(${obj.englishName})`) || "";

const now = () => new Date().toLocaleString("en-US");

const dateStarted = (s) => s.localeCompare(isoToPacific(today(), true)) <= 0;

export {
  decimal,
  dollar,
  formatAddress,
  formatPersonName,
  formatPersonNames,
  pagingDataToContent,
  formatBirthInfo,
  required,
  today,
  validEmail,
  yesOrNo,
  Children,
  bilingualName,
  BiPencil,
  BiPlus,
  BiPersonPlus,
  BiClockHistory,
  BiInfoCircle,
  BiToggle,
  OptionalField,
  formatPhoneNumber,
  formatPersonNamesWithLink,
  requiredZeroAccepted,
  isoToPacific,
  labelForTuitionDiscountApplied,
  now,
  dateStarted,
  getYear,
  BiCreditCard,
  BiPerson,
  BiAddress,
};
