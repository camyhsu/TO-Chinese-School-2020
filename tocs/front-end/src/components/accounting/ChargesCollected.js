import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AccountingService from "../../services/accounting.service";
import { dollar } from "../../utils/utilities";
import { Card, CardTitle, CardBody } from "../Cards";

const ChargesCollected = () => {
  const { schoolYearId, schoolYearName } = useParams();
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });

  useEffect(() => {
    document.title = "TOCS - Home";

    AccountingService.getChargesCollected(schoolYearId).then(
      (response) => {
        setContent({
          isLoaded: true,
          item: response.data,
        });
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
  }, [schoolYearId]);

  return (
    <Card size="large">
      <CardTitle>
        Tuition and Fee Collected For {schoolYearName} School Year
      </CardTitle>
      <CardBody>
        <dl className="row">
          <dt className="col-12 col-md-6 text-right text-md-right">
            Registration Fee
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {dollar(content.item.registration_fee_total, true)}
          </dd>
          <dt className="col-12 col-md-6 text-right text-md-right">Tuition</dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {dollar(content.item.tuition_total, true)}
          </dd>
          <dt className="col-12 col-md-6 text-right text-md-right">
            Book / Material Charge
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {dollar(content.item.book_charge_total, true)}
          </dd>
          <dt className="col-12 col-md-6 text-right text-md-right">
            PVA Membership Due
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {dollar(content.item.pvaDueInCents, true)}
          </dd>
          <dt className="col-12 col-md-6 text-right text-md-right">
            CCCA Membership Due
          </dt>
          <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
            {dollar(content.item.cccaDueInCents, true)}
          </dd>
        </dl>
      </CardBody>
    </Card>
  );
};

export default ChargesCollected;
