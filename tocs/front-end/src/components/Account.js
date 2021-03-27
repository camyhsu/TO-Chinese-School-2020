import React from "react";
import { Redirect, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { changePassword } from "../actions/user.action"

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <div className="col-md-12">
        <div className="card card-container--medium">
          <div className="card-body">
            <p>
              <strong>Username:</strong> {currentUser.username}
            </p>
            <strong>Roles:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
          </div>
          <div className="card-footer">
            <div className="row text-truncate">
              <div className="col-md-5 mb-md-0">
                <Link to={{
                  pathname: '/change-password-form',
                  params: {
                    callback: (obj) => {
                      return changePassword(obj);
                    }
                  }
                }} className="btn btn-light"><i className="bi-pencil"></i> Change Password</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;