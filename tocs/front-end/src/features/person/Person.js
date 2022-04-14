import React from "react";
import { formatPersonName } from "../../utils/utilities";

export const Person = ({
  chineseName,
  firstName,
  lastName,
  gender,
  birthMonth,
  birthYear,
  nativeLanguage,
}) => {
  return (
    <dl className="row">
      <dt className="col-12 col-md-6 text-left text-md-right">English Name:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {formatPersonName({ firstName, lastName })}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">Chinese Name:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {chineseName}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">
        Native Language:
      </dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {nativeLanguage}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">Gender:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {gender}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">
        Birth Month/Year:
      </dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {birthMonth &&
          birthYear &&
          String(birthMonth).padStart(2, "0") + "/" + birthYear}
      </dd>
    </dl>
  );
};
