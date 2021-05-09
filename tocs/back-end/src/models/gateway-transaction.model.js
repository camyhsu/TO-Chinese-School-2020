export default (sequelize, _Sequelize, fieldsFactory) => {
  const fields = fieldsFactory({ withId: true });
  const GatewayTransaction = sequelize.define('gateway_transaction', {
    ...fields,
  });

  /* Prototype */
  Object.assign(GatewayTransaction.prototype, {

  });

  /* Non-prototype */
  Object.assign(GatewayTransaction, {

  });

  return GatewayTransaction;
};
