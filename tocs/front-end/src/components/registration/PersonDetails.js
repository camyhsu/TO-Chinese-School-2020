import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { BiPlus, BiPencil, formatPersonName, Children } from '../../utils/utilities';
import { Card, CardBody, CardTitle, CardFooter } from "../Cards";
import Address from "../Address";
import Person from "../Person";

const Home = ({ location } = {}) => {
    const [reload, setReload] = useState(null);
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const [id, setId] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const { id: _id } = queryString.parse(location.search);
        setId(_id);

        if (id) {
            RegistrationService.getPerson(id).then((response) => {
                if (response && response.data) {
                    setContent({
                        isLoaded: true,
                        person: response.data.person,
                        families: response.data.families,
                        instructorAssignments: response.data.instructorAssignments
                    });
                }
            });
        }
    }, [dispatch, id, location.search, reload]);

    const deleteInstructorAssignment = (id) => {
        RegistrationService.deleteInstructorAssignment(id).then(
            (response) => {
                setReload(response.data);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent({
                    isLoaded: true,
                    error: { message: _content }
                });
            }
        );
    };

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

            {content.instructorAssignments && content.instructorAssignments.map((instructorAssignment, index) => {
                return (
                    <React.Fragment key={'instructorAssignment-' + index}>
                        <Card size="medium" plain="true">
                            <CardBody>
                                <CardTitle>Instructor Assignment for <br className="d-md-none" />{formatPersonName(content.person)}</CardTitle>
                                <dl className="row">
                                    <dt className="col-12 col-md-6 text-left text-md-right">School Year:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{instructorAssignment.schoolYear.name}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">School Class:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{instructorAssignment.schoolClass.chineseName}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">Start Date:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{instructorAssignment.startDate}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">End Date:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{instructorAssignment.endDate}</dd>
                                    <dt className="col-12 col-md-6 text-left text-md-right">Role:</dt>
                                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{instructorAssignment.role}</dd>
                                </dl>
                            </CardBody>
                            <CardFooter>
                                <div className="row text-truncate">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <Link to={`/registration/instructor-assignment?personId=${id}&id=${instructorAssignment.id}`} className="btn btn-light"><BiPencil /> Instructor Assignment</Link>
                                    </div>
                                    <div className="col-md-6 mb-3 mb-md-0 text-md-right">
                                        <button className="btn btn-primary btn-light" onClick={() => deleteInstructorAssignment(instructorAssignment.id)}>Remove This</button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </React.Fragment>
                );
            })}

            <Card size="medium" plain="true">
                <CardTitle>Available Actions</CardTitle>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to={'/registration/instructor-assignment?personId=' + id} className="btn btn-light"><BiPlus />Instructor Assignment</Link>
                        </div>
                        <div className="col-md-6">
                            <Link to={'/accounting/manual-transaction?personId=' + id} className="btn btn-light"><BiPlus />Manual Transaction</Link>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div >
    );
};

export default Home;