export default (sequelize, Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({
    withId: true,
    withStrings: [
      ['transactionType', 'transaction_type', true],
      ['paymentMethod', 'payment_method', true],
      ['checkNumber', 'check_number'],
      ['note'],
    ],
  });
  const ManualTransaction = sequelize.define('manual_transaction', {
    ...fields,
    amountInCents: {
      type: Sequelize.INTEGER,
      field: 'amount_in_cents',
      allowNull: false,
      validate: { min: 0 },
    },
    transactionDate: { type: Sequelize.DATE, field: 'transaction_date', allowNull: false },
  }, {
    validate: {
      startEndDateOrder() {
        if (this.paymentMethod === this.paymentMethods.PAYMENT_METHOD_CHECK && !this.checkNumber) {
          throw new Error('Check number cannot be empty');
        }
      },
    },
  });

  /* Prototype */
  Object.assign(ManualTransaction.prototype, {
    transactionTypes: {
      TRANSACTION_TYPE_REGISTRATION: 'Registration',
      TRANSACTION_TYPE_WITHDRAWAL: 'Withdrawal',
      TRANSACTION_TYPE_TEXTBOOK_PURCHASE: 'Textbook Purchase',
      TRANSACTION_TYPE_OTHER_PAYMENT: 'Other Payment',
      TRANSACTION_TYPE_OTHER_REFUND: 'Other Refund',
    },
    paymentMethods: {
      PAYMENT_METHOD_CHECK: 'Check',
      PAYMENT_METHOD_CASH: 'Cash',
    },
  });

  /* Non-prototype */
  Object.assign(ManualTransaction, {
    findTransactionBy: async (transactionById) => {
      const txs = await ManualTransaction.findAll({
        where: { transaction_by_id: transactionById },
        order: [['transaction_date', 'DESC']],
      });
      if (txs) {
        txs.forEach((tx) => Object.assign(tx.dataValues, { amountWithSign: ManualTransaction.amountWithSign(tx) }));
      }
      return txs;
    },
    amountWithSign: (tx) => (tx.amountInCents / 100)
        * (tx.transactionType === tx.transactionTypes.TRANSACTION_TYPE_WITHDRAWAL
          || tx.transactionType === tx.transactionTypes.TRANSACTION_TYPE_OTHER_REFUND ? -1 : 1),
  });

  return ManualTransaction;
};
