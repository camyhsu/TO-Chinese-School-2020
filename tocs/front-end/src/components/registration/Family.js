import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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

const Family = () => {
  const { familyId } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (familyId) {
      RegistrationService.getFamily(familyId).then((response) => {
        if (response && response.data) {
          setContent({
            isLoaded: true,
            item: response.data,
          });
        }
      });
    }
  }, [dispatch, familyId]);

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
                to={`/address-form/${family.address.id}/none/${family.id}/true`}
                className="btn btn-light"
              >
                <BiPencil /> Family Address
              </Link>
            )}
          </div>
          <div className="col-md-4 mb-3 mb-md-0 px-md-2 text-md-right">
            {!family.parentTwo && (
              <Link
                to={`/person-form/none/${family.id}/true/true`}
                className="btn btn-light"
              >
                <BiPersonPlus /> Parent
              </Link>
            )}
          </div>
          <div className="col-md-3 text-md-right">
            <Link
              to={`/person-form/none/${family.id}/false/true`}
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
