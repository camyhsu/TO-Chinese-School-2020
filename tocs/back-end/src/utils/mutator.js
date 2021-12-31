import _ from "lodash";
import { formatPhoneNumber } from "./utilities.js";

const formatAddressPhoneNumbers = (obj) => {
  _.forIn(obj, (value, key) => {
    if (typeof value === "object") {
      formatAddressPhoneNumbers(value);
    } else if (key === "homePhone" || key === "cellPhone") {
      Object.assign(obj, { [key]: formatPhoneNumber(value) });
    }
  });
  return obj;
};

const another = () => {};

export { formatAddressPhoneNumbers, another };
