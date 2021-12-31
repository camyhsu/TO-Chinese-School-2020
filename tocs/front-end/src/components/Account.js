import React from "react";
import { Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiPencil } from "../utils/utilities";
import { Card, CardBody, CardFooter } from "./Cards";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Card size="medium">
      <CardBody>
        <p>
          <strong>Username:</strong> {currentUser.username}
        </p>
        <strong>Roles:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </CardBody>
      <CardFooter>
        <div className="row text-truncate">
          <div className="col-md-5 mb-md-0">
            <Link to="/change-password-form" className="btn btn-light">
              <BiPencil /> Change Password
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Profile;
