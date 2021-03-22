import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';
import { useSelector } from "react-redux";

import UserService from "../../services/user.service";
import Address from "../Address";
import Person from "../Person";
import { savePerson, savePersonAddress, addParent, addChild, saveFamilyAddress } from "../../actions/user.action"
import { formatPersonName }from '../../utils/utilities';

const Home = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        document.title = "TOCS - Home";
        console.log('Landed Student Parent');

        UserService.getStudentParentBoard().then(
          (response) => {
            setContent(response.data);
          },
          (error) => {
            const _content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();

            setContent(_content);
          }
        );
    }, []);

    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="container">
            <div className="card-deck justify-content-center justify-content-xl-start">
                <div className="card card-container--medium">
                    <div className="card-body">
                        <h4>Person</h4>
                        <Person {...content.person} />
                        <Address {...(content.person && content.person.address)} />
                    </div>
                    <div className="card-footer">
                        <div className="row text-truncate">
                            <div className="col-md-5 mb-3 mb-md-0">
                                <Link to={{
                                    pathname: '/person-form',
                                    params: {
                                        title: 'Edit Person Details',
                                        ...content.person,
                                        callback: (obj) => {
                                            return savePerson(content.person.id, obj);
                                        }
                                    }
                                }} className="btn btn-light"><i className="bi-pencil"></i> Person Details</Link>
                            </div>
                            <div className="col-md-7 text-md-right">
                                <Link to={{
                                    pathname: '/address-form',
                                    params: {
                                        title: 'Edit Personal Address',
                                        ...(content.person && content.person.address),
                                        callback: (obj) => {
                                            return savePersonAddress(content.person.id, obj);
                                        }
                                    }
                                }} className="btn btn-light"><i className="bi-pencil"></i> Personal Address</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {content.families && content.families.map((family, findex) => {
                    return (
                        <React.Fragment key={'family-' + findex}>
                            <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
                            <div className="card card-container--medium">
                                <div className="card-body">
                                    <h4>Family for <br className="d-md-none" />{family.name}</h4>
                                    <dl className="row">
                                        <dt className="col-12 col-md-6 text-left text-md-right">Parent One:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentOne)}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentTwo)}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0"></dd>
                                    </dl>
                                    <Address {...family.address} />
                                </div>
                                <div className="card-footer">
                                    <div className="row text-truncate">
                                        <div className="col-md-5 mb-3 mb-md-0">
                                            <Link to={{
                                                pathname: '/address-form',
                                                params: {
                                                    title: 'Edit Family Address',
                                                    ...(family && family.address),
                                                    callback: (obj) => {
                                                        return saveFamilyAddress(family.familyId, obj);
                                                    }
                                                }
                                            }} className="btn btn-light"><i className="bi-pencil"></i> Family Address</Link>
                                    </div>
                                        <div className="col-md-4 mb-3 mb-md-0 px-md-2 text-md-right"><i className="person-plus"></i>
                                            {!family.parentTwo && <Link to={{
                                                pathname: '/person-form',
                                                params: {
                                                    title: 'Add Parent',
                                                    callback: (obj) => {
                                                        return addParent(family.familyId, obj);
                                                    }
                                                }
                                            }} className="btn btn-light"><i className="bi-person-plus"></i> Parent</Link>}
                                        </div>
                                        <div className="col-md-3 text-md-right">
                                            <Link to={{
                                                pathname: '/person-form',
                                                params: {
                                                    title: 'Add Child',
                                                    callback: (obj) => {
                                                        return addChild(family.familyId, obj);
                                                    }
                                                }
                                            }} className="btn btn-light"><i className="bi-person-plus"></i> Child</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {family.students && family.students.map((student, sindex) => {
                                return (
                                    <React.Fragment key={'student-' + sindex}>
                                        <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
                                        <div className="card card-container--medium">
                                            <div className="card-body">
                                                <h4>Student Information</h4>
                                                <Person {...student} />
                                            </div>
                                            <div className="card-footer">
                                                <div className="row text-truncate">
                                                    <div className="col-md-5 mb-md-0">
                                                        <Link to={{
                                                            pathname: '/person-form',
                                                            params: {
                                                                title: 'Edit Student Details',
                                                                ...student,
                                                                callback: (obj) => {
                                                                    return savePerson(student.id, obj);
                                                                }
                                                            }
                                                        }} className="btn btn-light"><i className="bi-pencil"></i> Student Details</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    );
                })}

            </div>
        </div>
    );
};

export default Home;