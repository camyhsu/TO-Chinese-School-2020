import config from "config";

const contacts = config.get("contacts");

const sendPaymentConfirmation = ({ recipient }) => {
  const obj = {
    subject: "Thousand Oaks Chinese School - Payment Confirmation",
    recipient,
  };
  console.log(obj);
};

const sendTextBookNotification = () => {
  const obj = {
    subject: "TOCS - text books for new students",
    recipient: contacts.textBookManager,
  };
  console.log(obj);
};

const sendRegistrationStaffNotification = () => {
  const obj = {
    subject: "TOCS - new students registered",
    recipient: contacts.registration,
  };
  console.log(obj);
};

export {
  sendPaymentConfirmation,
  sendTextBookNotification,
  sendRegistrationStaffNotification,
};
