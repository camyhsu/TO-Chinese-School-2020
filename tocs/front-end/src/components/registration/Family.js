import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import RegistrationService from "../../services/registration.service";
import {
  formatPersonName,
  BiPencil,
  BiPersonPlus,
  Children,
  formatPersonNamesWithLink,
} from "../../utils/utilities";
import { Card, CardTitle, CardBody, CardFooter } from "../Cards";
import Address from "../Address";

const Family = ({ location } = {}) => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const { id } = queryString.parse(location.search);
    if (id) {
      RegistrationService.getFamily(id).then((response) => {
        if (response && response.data) {
          setContent({
            isLoaded: true,
            item: response.data,
          });
        }
      });
    }
  }, [dispatch, location.search]);

  const family = content.item;
  return (
    <Card size="medium">
      <CardTitle>
        Family for <br className="d-md-none" />
        {formatPersonName(family.parentOne)}
      </CardTitle>
      <CardBody>
        <dl className="row">
          <dt className="col-12 col-md-6 text-left text-md-right">
            Parent One:
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {formatPersonNamesWithLink(family.parentOne)}
          </dd>
        </dl>
        <dl className="row">
          <dt className="col-12 col-md-6 text-left text-md-right">
            Parent Two:
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {formatPersonNamesWithLink(family.parentTwo)}
          </dd>
        </dl>
        <dl className="row">
          <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            <Children children={family.children} link="true" />
          </dd>
        </dl>
        <Address {...family.address} />
      </CardBody>
      <CardFooter>
        <div className="row text-truncate">
          <div className="col-md-5 mb-3 mb-md-0">
            {family && family.address && (
              <Link
                to={`/address-form?registration=true&id=${family.address.id}&familyId=${family.id}`}
                className="btn btn-light"
              >
                <BiPencil /> Family Address
              </Link>
            )}
          </div>
          <div className="col-md-4 mb-3 mb-md-0 px-md-2 text-md-right">
            {!family.parentTwo && (
              <Link
                to={`/person-form?registration=true&familyId=${family.id}&isParentTwo=true`}
                className="btn btn-light"
              >
                <BiPersonPlus /> Parent
              </Link>
            )}
          </div>
          <div className="col-md-3 text-md-right">
            <Link
              to={`/person-form?registration=true&familyId=${family.id}`}
              className="btn btn-light"
            >
              <BiPersonPlus /> Child
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Family;
