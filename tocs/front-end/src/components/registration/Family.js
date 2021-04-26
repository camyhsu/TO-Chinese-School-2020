import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { formatPersonNames, formatAddress } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const Family = ({ location } = {}) => {
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const dispatch = useDispatch();

    useEffect(() => {
        const { id } = queryString.parse(location.search);
        if (id) {
            RegistrationService.getFamily(id).then((response) => {
                if (response && response.data) {
                    setContent({
                        isLoaded: true,
                        item: response.data
                    })
                }
            });
        }
    }, [dispatch, location.search]);

    const family = content.item;
    return (
        <Card size="large">
            <CardBody>
                <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">Parent One:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonNames(family.parentOne)}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonNames(family.parentTwo)}</dd>
                </dl>
                <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0"></dd>
                </dl>
                <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">Address:</dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatAddress(family.address)}</dd>
                </dl>
            </CardBody>
        </Card>
    );
};

export default Family;