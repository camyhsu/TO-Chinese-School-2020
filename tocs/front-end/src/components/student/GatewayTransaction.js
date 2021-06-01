import { Card, CardBody, CardTitle } from "../Cards";
import { isoToPacific, dollar, formatPersonNames } from '../../utils/utilities';
import _ from 'lodash';

const GatewayTransaction = ({ gatewayTransaction, forStaff, paidBy } = {}) => {
    return (
        <Card size="medium">
            <CardBody>
                <CardTitle>{gatewayTransaction.credit ? 'Refund' : 'Payment'}</CardTitle>
                <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">Processed on:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{isoToPacific(gatewayTransaction.updatedAt)}</dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">{gatewayTransaction.credit ? 'Refunded' : 'Charged'} Amount:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{dollar(gatewayTransaction.amountInCents, true)}</dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">Card:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{_.capitalize(gatewayTransaction.creditCardType)} ending {gatewayTransaction.creditCardLastDigits}</dd>
                    {forStaff && (
                        <>
                        <dt className="col-12 col-md-6 text-left text-md-right">{gatewayTransaction.credit ? 'Refunded to' : 'Paid by'}:</dt>
                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonNames(paidBy)}</dd>
                        </>
                    )}
                    <dt className="col-12 col-md-6 text-left text-md-right">Reference Number:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{gatewayTransaction.referenceNumber}</dd>
                </dl>
            </CardBody>
        </Card>
    );
};

export default GatewayTransaction;