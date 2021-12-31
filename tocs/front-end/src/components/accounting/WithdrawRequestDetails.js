import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import AccountingService from "../../services/accounting.service";
import { dollar, formatPersonNames, isoToPacific } from "../../utils/utilities";
import { Card, CardTitle, CardBody, CardFooter } from "../Cards";

const WithdrawRequests = ({ location } = {}) => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });

  useEffect(() => {
    document.title = "TOCS - Home";

    const { id: _id } = queryString.parse(location.search);

    AccountingService.getWithdrawRequest(_id).then(
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
  }, [location.search]);

  const withDrawRequest = content.item;
  return (
    <Card size="medium">
      <CardTitle>Refund Preview</CardTitle>
      <CardBody>
        {withDrawRequest && (
          <>
            <dl className="row">
              <dt className="col-12 col-md-6 text-md-right">Request Date:</dt>
              <dd className="col-12 col-md-6 border-bottom border-md-bottom-0">
                {isoToPacific(withDrawRequest.createdAt, true)}
              </dd>
              <dt className="col-12 col-md-6 text-md-right">Status:</dt>
              <dd className="col-12 col-md-6 border-bottom border-md-bottom-0">
                {withDrawRequest.status}
              </dd>

              <dt className="col-12 col-md-6 text-md-right">Name on Check:</dt>
              <dd className="col-12 col-md-6 border-bottom border-md-bottom-0">
                {withDrawRequest.requestByName}
              </dd>
              <dt className="col-12 col-md-6 text-md-right">Address:</dt>
              <dd className="col-12 col-md-6 border-bottom border-md-bottom-0">
                {withDrawRequest.requestByAddress}
              </dd>
            </dl>
            {withDrawRequest.withdrawRequestDetails &&
              withDrawRequest.withdrawRequestDetails.map(
                (withdrawRequestDetail, index) => {
                  return (
                    <React.Fragment key={"wrd-" + index}>
                      <p>
                        For {formatPersonNames(withdrawRequestDetail.student)}
                      </p>
                      <dl className="row">
                        <dt className="col-12 col-md-9 text-md-right">
                          Registration Fee:
                        </dt>
                        <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                          {dollar(
                            withdrawRequestDetail.refundRegistrationFeeInCents,
                            true
                          )}
                        </dd>
                        <dt className="col-12 col-md-9 text-md-right">
                          Tuition:
                        </dt>
                        <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                          {dollar(
                            withdrawRequestDetail.refundTuitionInCents,
                            true
                          )}
                        </dd>
                        <dt className="col-12 col-md-9 text-md-right">
                          Books / Material:
                        </dt>
                        <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                          {dollar(
                            withdrawRequestDetail.refundBookChargeInCents,
                            true
                          )}
                        </dd>
                      </dl>
                      <hr />
                    </React.Fragment>
                  );
                }
              )}

            <dl className="row">
              <dt className="col-12 col-md-9 text-md-right">
                PVA Annual Membership:
              </dt>
              <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                {dollar(withDrawRequest.refundPvaDueInCents, true)}
              </dd>
              <dt className="col-12 col-md-9 text-md-right">
                CCCA Annual Membership:
              </dt>
              <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                {dollar(withDrawRequest.refundCccaDueInCents, true)}
              </dd>
            </dl>
            <hr />
            <dl className="row">
              <dt className="col-12 col-md-9 text-md-right">Grand Total:</dt>
              <dd className="col-12 col-md-3 border-bottom border-md-bottom-0 text-md-right">
                {dollar(withDrawRequest.refundGrandTotalInCents, true)}
              </dd>
            </dl>
          </>
        )}
      </CardBody>
      <CardFooter>
        <div className="row">
          <div className="col-md-12">
            <Link to="/admin/withdraw-requests" className="btn btn-light">
              Back
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WithdrawRequests;
