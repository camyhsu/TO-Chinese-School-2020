import { isEmail } from "validator";

const d = (s) => s || '';

const formatPersonName = (person) => (person && (person.firstName + ' ' + person.lastName)) || '';

const formatAddress = (address) =>
    (address && `${d(address.street)} ${d(address.city)}${d(address.city) && ','} ${d(address.state)} ${d(address.zipcode)}`)
    || '';

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const vrepassword = (value, _props, components) => {
    if (value !== components['password'][0].value) {
        return (
            <div className="alert alert-danger" role="alert">
                The passwords does not match.
            </div>
        );
    }
};

export {
    formatAddress, formatPersonName, required, validEmail, vusername, vpassword, vrepassword
}