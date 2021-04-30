import React from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from "validator";

const d = (s) => s || '';

const dollar = (s) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(s);

const decimal = (s) => new Intl.NumberFormat('en-IN', { style: 'decimal', minimumFractionDigits: 2 }).format(s);

const formatPersonName = (person) => (person && (person.firstName + ' ' + person.lastName)) || '';

const formatPersonNames = (person) => (person && (`${person.chineseName || ''}(${person.firstName} ${person.lastName})`)) || '';

const formatPersonNamesWithLink = (person) => (<>
    {person && <Link to={'/registration/show-person?id=' + person.id}>{formatPersonNames(person)}</Link>}
</>);

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

const yesOrNo = (b) => b ? 'Yes' : 'No';

const today = () => new Date().toISOString().split('T')[0];

const BiPencil = () => <i className="bi-pencil"></i>;

const BiPlus = () => <i className="bi-plus"></i>;

const BiPersonPlus = () => <i className="bi-person-plus"></i>;

const BiClockHistory = () => <i className="bi-clock-history"></i>;

const BiInfoCircle  = () => <i className="bi-info-circle"></i>;

const BiToggle = ({ on }) => <i className={on ? 'bi-toggle-on' : 'bi-toggle-off'}></i>;

const OptionalField = () => <span className="text-muted"><small>(Optional)</small></span>;

const pagingDataToContent = (response, rowsPerPage) => ({
    isLoaded: true,
    items: response.data.rows,
    maxPage: Math.trunc(response.data.count / rowsPerPage) + (response.data.count % rowsPerPage === 0 ? 0 : 1)
});

const Children = ({ children = [], link } = {}) => children.map((c, i) => (
    <React.Fragment key={'child-' + i}>
        {link ? formatPersonNamesWithLink(c) : formatPersonNames(c)}{i !== children.length - 1 ? (<br />) : ''}
    </React.Fragment>)
);
    
export {
    decimal, dollar, formatAddress, formatPersonName, formatPersonNames, pagingDataToContent,
    required, today, validEmail, vusername, vpassword, vrepassword, yesOrNo, Children,
    BiPencil, BiPlus, BiPersonPlus, BiClockHistory, BiInfoCircle, BiToggle, OptionalField,
    formatPersonNamesWithLink
}