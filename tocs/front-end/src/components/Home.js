import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Announcement,
  AcademicVicePrincipal,
  AccountingOfficer,
  ActivityOfficer,
  CommunicationOfficer,
  InstructionOfficer,
  Instructor,
  Librarian,
  Principal,
  RegistrationOfficer,
  StudentParent,
} from "./boards/index";

const Home = () => {
  useEffect(() => {
    document.title = "TOCS - Home";
  }, []);

  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  const hasRole = (role) =>
    user.roles &&
    (user.roles.includes(role) || user.roles.includes("Super User"));

  return (
    user && (
      <>
        <div className="container">
          <div className="card-deck justify-content-center justify-content-xl-start">
            {hasRole("Principal") && <Principal />}
            {hasRole("Academic Vice Principal") && <AcademicVicePrincipal />}
            {hasRole("Registration Officer") && <RegistrationOfficer />}
            {hasRole("Accounting Officer") && <AccountingOfficer />}
            {hasRole("Activity Officer") && <ActivityOfficer />}
            {hasRole("Communication Officer") && <CommunicationOfficer />}
            {hasRole("Instruction Officer") && <InstructionOfficer />}
            {hasRole("Librarian") && <Librarian />}
            {hasRole("Instructor") && <Instructor />}
            <Announcement />
          </div>
        </div>
        {hasRole("Student Parent") && <StudentParent />}
      </>
    )
  );
};

export default Home;
