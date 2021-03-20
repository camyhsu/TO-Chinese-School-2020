import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';
import { useSelector } from "react-redux";

import UserService from "../../services/user.service";
import Address from "../Address";
import Person from "../Person";
import { savePerson, addParent, addChild } from "../../actions/user.action"

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
                        <Address {...content.address} />
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
                                            return savePerson(content.person.personId, obj);
                                        }
                                    }
                                }} className="btn btn-light"><i className="bi-pencil"></i> Person Details</Link>
                            </div>
                            <div className="col-md-7 text-md-right">
                                <Link to={{
                                    pathname: '/address-form',
                                    params: {
                                        title: 'Edit Personal Address',
                                        ...content.person,
                                        callback: (obj) => {
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
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{family.parentOne}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{family.parentTwo}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0"></dd>
                                    </dl>
                                    <Address {...family.address} />
                                </div>
                                <div className="card-footer">
                                    <div className="row text-truncate">
                                        <div className="col-md-5 mb-3 mb-md-0"><a href="#123" className="btn btn-light"><i className="bi-pencil"></i> Family Address</a></div>
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
                                                        console.log('b4', family.familyId)
                                                        return addChild(family.familyId, obj);
                                                    }
                                                }
                                            }} className="btn btn-light"><i className="bi-person-plus"></i> Child</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {family.students.map((student, sindex) => {
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
                                                                    return savePerson(student.personId, obj);
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