import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { userHasRequiredRole } from "./Role";
import { UserStatus } from "../features/user/UserStatus";

export const PrivateRoute = ({ children, requiredRoles }) => {
  const location = useLocation();
  const { status, user } = useSelector((state) => state.user);

  if (status !== UserStatus.SIGNED_IN) {
    return <Navigate to="/sign-in" />;
  }
  if (userHasRequiredRole(user.roles, requiredRoles)) {
    return children;
  } else {
    // we don't have an access denied page
    // simply return the user to the home page where authorized items are shown
    console.log(
      `Unauthorized access to ${location.pathname} -- redirecting to HOME`
    );
    return <Navigate to="/home" />;
  }
};
