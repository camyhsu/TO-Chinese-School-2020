import React from "react";
import { formatAddress } from "../utils/utilities";

const Address = ({
  street,
  city,
  state,
  zipcode,
  homePhone,
  cellPhone,
  email,
}) => {
  return (
    <dl className="row">
      <dt className="col-12 col-md-6 text-left text-md-right">Address:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {formatAddress({ street, city, state, zipcode })}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">Home Phone:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {homePhone}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">Cell Phone: </dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {cellPhone}
      </dd>
      <dt className="col-12 col-md-6 text-left text-md-right">Email:</dt>
      <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
        {email}
      </dd>
    </dl>
  );
};

export default Address;
