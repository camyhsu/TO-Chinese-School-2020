export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory(
    {
      withId: true,
      withStrings: [
        ['statusCode', 'status_code'],
        ['requestByName', 'request_by_name'],
        ['requestByAddress', 'request_by_address'],
      ],
      withIntegers: [
        ['refundPvaDueInCents', 'refund_pva_due_in_cents'],
        ['refundCccaDueInCents', 'refund_ccca_due_in_cents'],
        ['refundGrandTotalInCents', 'refund_grand_total_in_cents'],
      ],
    },
  );
  const WithdrawRequest = sequelize.define('withdraw_request', {
    ...fields,
  });

  /* Prototype */
  Object.assign(WithdrawRequest.prototype, {
    statuses: {
      STATUS_APPROVED: 'A',
      STATUS_DECLINED: 'D',
      STATUS_CANCELLED: 'C',
      STATUS_PENDING_FOR_APPROVAL: 'P',
    },
    status() {
      console.log(this)
      console.log(this.statusCode, this.statuses.STATUS_CANCELLED);
      if (this.statusCode === this.statuses.STATUS_CANCELLED) {
        return 'CANCELLED';
      }
      if (this.statusCode === this.statuses.STATUS_APPROVED) {
        return 'APPROVED';
      }
      if (this.statusCode === this.statuses.STATUS_DECLINED) {
        return 'DECLINED';
      }
      return 'PENDING FOR APPROVAL';
    },
  });

  /* Non-prototype */
  Object.assign(WithdrawRequest, {

  });

  return WithdrawRequest;
};
