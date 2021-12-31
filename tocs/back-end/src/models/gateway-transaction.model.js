export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      ["creditCardType", "credit_card_type"],
      ["creditCardLastDigits", "credit_card_last_digits"],
      ["approvalStatus", "approval_status"],
      ["errorMessage", "error_message"],
      ["approvalCode", "approval_code"],
      ["referenceNumber", "reference_number"],
      ["responseDump", "response_dump"],
    ],
  });
  const GatewayTransaction = sequelize.define("gateway_transaction", {
    ...fields,
    amountInCents: {
      type: Sequelize.INTEGER,
      field: "amount_in_cents",
      allowNull: false,
    },
    credit: {
      type: Sequelize.BOOLEAN,
      field: "credit",
      defaultValue: false,
    },
  });

  /* Prototype */
  Object.assign(GatewayTransaction.prototype, {
    // Known approval_status from Linkpoint Gateway - APPROVED, DECLINED, DUPLICATE, FRAUD
    status: {
      APPROVAL_STATUS_APPROVED: "APPROVED",
      APPROVAL_STATUS_DECLINED: "DECLINED",
      APPROVAL_STATUS_ERROR: "ERROR",
    },
    setApprovalStatusBasedOnAuthorizeNetResponse(responseCode) {
      if (responseCode === "1") {
        this.approvalStatus =
          GatewayTransaction.prototype.status.APPROVAL_STATUS_APPROVED;
      } else if (responseCode === "2") {
        this.approvalStatus =
          GatewayTransaction.prototype.status.APPROVAL_STATUS_DECLINED;
      } else {
        this.approvalStatus =
          GatewayTransaction.prototype.status.APPROVAL_STATUS_ERROR;
      }
    },
  });

  /* Non-prototype */
  Object.assign(GatewayTransaction, {});

  return GatewayTransaction;
};
