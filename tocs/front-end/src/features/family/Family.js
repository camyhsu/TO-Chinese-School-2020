import React from "react";
import { Children, formatPersonName } from "../../utils/utilities";
import Address from "../../components/Address";

export const Family = ({ family }) => {
  return (
    <>
      <dl className="row">
        <dt className="col-12 col-md-6 text-left text-md-right">Parent One:</dt>
        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
          {formatPersonName(family.parentOne)}
        </dd>
        <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
          {formatPersonName(family.parentTwo)}
        </dd>
        <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
          <Children children={family.children} />
        </dd>
      </dl>
      <Address {...family.address} />
    </>
  );
};
