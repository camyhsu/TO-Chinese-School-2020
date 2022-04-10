import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardBody, CardFooter } from "../../components/Cards";
import { BiPencil } from "../../components/decorationElements";

export const Account = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Card>
      <CardBody>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </CardBody>
      <CardFooter>
        <div className="row text-truncate">
          <div className="col-md-5 mb-md-0">
            <Link to="/change-password" className="btn btn-light">
              <BiPencil /> Change Password
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
