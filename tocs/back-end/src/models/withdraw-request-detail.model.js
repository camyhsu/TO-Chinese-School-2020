export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withIntegers: [
      ["refundRegistrationFeeInCents", "refund_registration_fee_in_cents"],
      ["refundTuitionInCents", "refund_tuition_in_cents"],
      ["refundBookChargeInCents", "refund_book_charge_in_cents"],
    ],
  });
  const WithdrawRequestDetail = sequelize.define("withdraw_request_detail", {
    ...fields,
  });

  /* Prototype */
  Object.assign(WithdrawRequestDetail.prototype, {});

  /* Non-prototype */
  Object.assign(WithdrawRequestDetail, {});

  return WithdrawRequestDetail;
};
