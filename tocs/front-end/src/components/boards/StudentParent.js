import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../actions/auth.action';
import UserService from "../../services/user.service";
import Address from "../Address";
import Person from "../Person";
import { formatPersonName, BiPencil, BiPlus, BiPersonPlus, Children }from '../../utils/utilities';
import { Card, CardBody, CardFooter, CardTitle } from "../Cards";

const Home = () => {
    const [content, setContent] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'TOCS - Home';

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
            if (_content && _content.message && _content.message === 'Unauthorized!') {
                dispatch(logout());
            }
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
                <Card size="medium" plain="true">
                    <CardBody>
                        <CardTitle>Person</CardTitle>
                        <Person {...content.person} />
                        <Address {...(content.person && content.person.address)} />
                    </CardBody>
                    <CardFooter>
                        <div className="row text-truncate">
                            <div className="col-md-5 mb-3 mb-md-0">
                                {content.person && <Link to={`/person-form?id=${content.person.id}`} className="btn btn-light"><BiPencil/> Person Details</Link>}
                            </div>
                            <div className="col-md-7 text-md-right">
                                {content.person && !content.person.addressId && <Link to={`/address-form?personId=${content.person.id}`} className="btn btn-light"><BiPlus/> Personal Address</Link>}
                                {content.person && content.person.addressId && <Link to={`/address-form?id=${content.person.addressId}&personId=${content.person.id}`} className="btn btn-light"><BiPencil/> Personal Address</Link>}
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
                                    <CardTitle>Family for <br className="d-md-none" />{formatPersonName(family.parentOne)}</CardTitle>
                                    <dl className="row">
                                        <dt className="col-12 col-md-6 text-left text-md-right">Parent One:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentOne)}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Parent Two:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{formatPersonName(family.parentTwo)}</dd>
                                        <dt className="col-12 col-md-6 text-left text-md-right">Children:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                                        <Children children={family.students}/>
                                        </dd>
                                    </dl>
                                    <Address {...family.address} />
                                </CardBody>
                                <CardFooter>
                                    <div className="row text-truncate">
                                        <div className="col-md-5 mb-3 mb-md-0">
                                        <Link to={`/address-form?id=${family.addressId}&familyId=${family.familyId}`} className="btn btn-light"><BiPencil/> Family Address</Link>
                                    </div>
                                        <div className="col-md-4 mb-3 mb-md-0 px-md-2 text-md-right">
                                            {!family.parentTwo && <Link to={`/person-form?familyId=${family.familyId}&isParentTwo=true`} className="btn btn-light"><BiPersonPlus/> Parent</Link>}
                                        </div>
                                        <div className="col-md-3 text-md-right">
                                            <Link to={`/person-form?familyId=${family.familyId}`} className="btn btn-light"><BiPersonPlus/> Child</Link>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>

                            {family.students && family.students.map((student, sindex) => {
                                return (
                                    <React.Fragment key={'student-' + sindex}>
                                        <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
                                        <Card size="medium" plain="true">
                                            <CardBody>
                                                <CardTitle>Student Information</CardTitle>
                                                <Person {...student} />
                                            </CardBody>
                                            <CardFooter>
                                                <div className="row text-truncate">
                                                    <div className="col-md-5 mb-md-0">
                                                    <Link to={`/person-form?id=${student.id}`} className="btn btn-light"><BiPencil/> Student Details</Link>
                                                    </div>
                                                </div>
                                            </CardFooter>
                                        </Card>
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