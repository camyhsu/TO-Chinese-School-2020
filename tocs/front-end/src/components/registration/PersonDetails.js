import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { BiPlus, BiPencil, formatPersonNames, formatPersonName, Children } from '../../utils/utilities';
import { Card, CardBody, CardTitle, CardFooter } from "../Cards";
import Address from "../Address";
import Person from "../Person";

const Home = ({ location } = {}) => {
    const [id, setId] = useState(null);
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const dispatch = useDispatch();

    useEffect(() => {
        const { id } = queryString.parse(location.search);
        setId(id);
        if (id) {
            RegistrationService.getPerson(id).then((response) => {
                if (response && response.data) {
                    setContent({
                        isLoaded: true,
                        person: response.data.person,
                        families: response.data.families
                    })
                }
            });
        }
    }, [dispatch, location.search]);

    return (
        <div className="card-deck justify-content-center justify-content-xl-start">
            <Card size="medium" plain="true">
                <CardBody>
                    <CardTitle>Person</CardTitle>
                    <Person {...content.person} />
                    <Address {...(content.person && content.person.address)} />
                </CardBody>
                <CardFooter>
                    <div className="row text-truncate">
                        <div className="col-md-5 mb-3 mb-md-0">
                            {content.person && <Link to={`/person-form?registration=true&id=${content.person.id}`} className="btn btn-light"><BiPencil /> Person Details</Link>}
                        </div>
                        <div className="col-md-7 text-md-right">
                            {content.person && !content.person.addressId && <Link to={`/address-form?registration=true&personId=${content.person.id}`} className="btn btn-light"><BiPlus /> Personal Address</Link>}
                            {content.person && content.person.addressId && <Link to={`/address-form?registration=true&id=${content.person.addressId}&personId=${content.person.id}`} className="btn btn-light"><BiPencil /> Personal Address</Link>}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {content.families && content.families.map((family, findex) => {
                return (
                    <React.Fragment key={'family-' + findex}>
                        <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
                        <Card size="medium" plain="true">
                            <CardBody>
                                <CardTitle>Family for <br className="d-md-none" />{family.name}</CardTitle>
                                <dl className="row">
                                    <dt className="col-12 col-md-6 text-left text-md-right">Parent One:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentOne)}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentTwo)}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                                        <Children children={family.children} />
                                    </dd>
                                </dl>
                                <Address {...family.address} />
                            </CardBody>
                            <CardFooter>
                                <div className="row text-truncate">
                                    <div className="col-md-5 mb-3 mb-md-0">
                                        <Link to={`/registration/family?id=${family.id}`} className="btn btn-light"><BiPencil /> Family Data</Link>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Home;