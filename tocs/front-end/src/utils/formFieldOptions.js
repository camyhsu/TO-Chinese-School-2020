export const birthYearValidation = {
  min: { value: 1901, message: "More than 120 years old?" },
  max: {
    value: `${new Date().getFullYear() - 10}`,
    message: "A parent already?",
  },
  setValueAs: (value) => value.trim(),
};

export const emailValidation = {
  required: "Required!",
  pattern: {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Invalid email address",
  },
  setValueAs: (value) => value.trim().toLowerCase(),
};

export const passwordValidation = {
  required: "Required!",
  minLength: { value: 6, message: "At least 6 characters" },
  setValueAs: (value) => value.trim(),
};

export const phoneNumberValidation = {
  pattern: {
    value: /^[0-9]{10}$/,
    message: "Phone number should be 10 digits",
  },
  setValueAs: (value) => value.trim().replace(/\D/g, ""),
};

export const requiredOnly = { required: "Required!" };

export const trimOnly = { setValueAs: (value) => value.trim() };

export const trimAndRequired = {
  required: "Required!",
  setValueAs: (value) => value.trim(),
};

export const usernameValidation = {
  required: "Required!",
  minLength: { value: 3, message: "At least 3 characters" },
  setValueAs: (value) => value.trim(),
};

export const zipcodeValidation = {
  required: "Required!",
  pattern: { value: /^\d{5}(?:[- ]?\d{4})?$/, message: "Invalid zipcode" },
  setValueAs: (value) => value.trim(),
};
