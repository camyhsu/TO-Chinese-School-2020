import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/user.service";
import Address from "../Address";
import { Family } from "../../features/family/Family";
import { Person } from "../../features/person/Person";
import { formatPersonName, BiPlus, Children } from "../../utils/utilities";
import { Card, CardBody, CardFooter, CardTitle } from "../Cards";
import { BiPencil, BiPersonPlus } from "../decorationElements";
import { userSignOut } from "../../features/user/userSlice";

const Home = () => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getStudentParentBoard().then(
      (response) => {
        console.log(JSON.stringify(response.data));
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        console.log(_content);
        if (
          _content &&
          _content.message &&
          _content.message === "Unauthorized!"
        ) {
          dispatch(userSignOut());
        }
      }
    );
  }, [dispatch]);

  const { user: currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  const { person, family, registrationStarter } = content;
  let registrationStartTargetRoute = null;
  if (registrationStarter) {
    if (registrationStarter.existingClassTrack) {
      if (registrationStarter.existingClassTrack === "EC") {
        registrationStartTargetRoute = `/student/registration/language-class-ec/${registrationStarter.schoolYearId}`;
      } else {
        registrationStartTargetRoute = `/student/registration/language-class-regular/${registrationStarter.schoolYearId}`;
      }
    } else {
      registrationStartTargetRoute = `/student/registration/select-class-track/${registrationStarter.schoolYearId}`;
    }
  }

  return (
    <div className="container">
      <div className="card-deck justify-content-center justify-content-xl-start">
        <Card size="medium" plain="true">
          <CardBody>
            <CardTitle>Family</CardTitle>
            {content.family && <Family family={content.family} />}
          </CardBody>
          <CardFooter>
            <div className="row text-truncate">
              {content.family && (
                <div className="col-md-3 text-md-right">
                  <Link
                    to={`/student/add/${content.family.id}`}
                    className="btn btn-light"
                  >
                    <BiPersonPlus /> Child
                  </Link>
                </div>
              )}
              {/* TODO - edit family address not working yet */}
              {/*<div className="col-md-5 mb-3 mb-md-0">*/}
              {/*  {content.family && (*/}
              {/*    <Link*/}
              {/*      to={`/address-form/${content.family.addressId}/none/${content.family.id}/false`}*/}
              {/*      className="btn btn-light"*/}
              {/*    >*/}
              {/*      <BiPencil /> Family Address*/}
              {/*    </Link>*/}
              {/*  )}*/}
              {/*</div>*/}
              {/* TODO - add the second parent not working yet */}
              {/*<div className="col-md-4 mb-3 mb-md-0 px-md-2 text-md-right">*/}
              {/*  {!content.family.parentTwo && (*/}
              {/*    <Link*/}
              {/*      to={`/person-form/none/${content.family.id}/true/false`}*/}
              {/*      className="btn btn-light"*/}
              {/*    >*/}
              {/*      <BiPersonPlus /> Parent*/}
              {/*    </Link>*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>
          </CardFooter>
        </Card>
        <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
        <Card size="medium" plain="true">
          <CardBody>
            <CardTitle>Parent</CardTitle>
            {person && <Person {...person} />}
            {person?.address && <Address {...person.address} />}
          </CardBody>
          <CardFooter>
            <div className="row text-truncate">
              <div className="col-md-5 mb-3 mb-md-0">
                {person && (
                  <Link
                    to={`/parent/edit/${person.id}`}
                    className="btn btn-light"
                  >
                    <BiPencil /> Parent
                  </Link>
                )}
              </div>
              {/* TODO - adding / editing address not working yet */}
              {/*<div className="col-md-7 text-md-right">*/}
              {/*  {person && !person.addressId && (*/}
              {/*    <Link*/}
              {/*      to={`/address-form/none/${person.id}/none/false`}*/}
              {/*      className="btn btn-light"*/}
              {/*    >*/}
              {/*      <BiPlus /> Personal Address*/}
              {/*    </Link>*/}
              {/*  )}*/}
              {/*  {person && person.addressId && (*/}
              {/*    <Link*/}
              {/*      to={`/address-form/${person.addressId}/${person.id}/none/false`}*/}
              {/*      className="btn btn-light"*/}
              {/*    >*/}
              {/*      <BiPencil /> Personal Address*/}
              {/*    </Link>*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>
          </CardFooter>
        </Card>
        {family?.children &&
          family.children.map((student, sindex) => (
            <React.Fragment key={`student-${sindex}`}>
              <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
              <Card size="medium" plain="true">
                <CardBody>
                  <CardTitle>Student</CardTitle>
                  <Person {...student} />
                </CardBody>
                <CardFooter>
                  <div className="row text-truncate">
                    <div className="col-md-5 mb-md-0">
                      <Link
                        to={`/student/edit/${student.id}`}
                        className="btn btn-light"
                      >
                        <BiPencil /> Student
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </React.Fragment>
          ))}
        {registrationStarter && family?.children && (
          <>
            <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
            <Card size="medium" plain="true">
              <CardBody>
                <CardTitle>
                  Register For {registrationStarter.schoolYearName} School Year
                </CardTitle>
                <Link
                  to={registrationStartTargetRoute}
                  className="btn btn-dark"
                >
                  Start
                </Link>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
