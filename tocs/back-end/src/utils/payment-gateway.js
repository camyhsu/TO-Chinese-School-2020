import config from 'config';
import authorizeNet from 'authorizenet';

const { APIContracts, APIControllers } = authorizeNet;

const paymentGatewayConfig = config.get('paymentGateway');

const process = ({
  invoiceNumber, amount, creditCard,
} = {}) => {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(paymentGatewayConfig.apiLoginKey);
  merchantAuthenticationType.setTransactionKey(paymentGatewayConfig.transactionKey);

  const card = new APIContracts.CreditCardType();
  card.setCardNumber(creditCard.cardNumber);
  card.setExpirationDate(creditCard.expirationDate);
  card.setCardCode(creditCard.cardCode);

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(card);

  const orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(invoiceNumber);
  orderDetails.setDescription('Product Description');

  const transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(amount);
  transactionRequestType.setOrder(orderDetails);

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  // pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  return new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      const rtn = {
        response: JSON.stringify(response),
        successful: false,
      };
      // pretty print response
      console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
          if (response.getTransactionResponse().getMessages() != null) {
            rtn.successful = true;
            rtn.transactionId = response.getTransactionResponse().getTransId();
            rtn.authorizationCode = response.getTransactionResponse().getAuthCode();
            rtn.responseCode = response.getTransactionResponse().getResponseCode();
            rtn.messageCode = response.getTransactionResponse().getMessages().getMessage()[0].getCode();
            rtn.description = response.getTransactionResponse().getMessages().getMessage()[0].getDescription();
          } else if (response.getTransactionResponse().getErrors() != null) {
            rtn.errorCode = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
            rtn.errorMessage = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
          }
        } else if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
          rtn.errorCode = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
          rtn.errorMessage = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
        } else {
          rtn.errorCode = response.getMessages().getMessage()[0].getCode();
          rtn.errorMessage = response.getMessages().getMessage()[0].getText();
        }
      } else {
        rtn.errorMessage = 'Null Response';
      }
      resolve(rtn);
    });
  });
};

const another = () => {};

export {
  process, another,
};
