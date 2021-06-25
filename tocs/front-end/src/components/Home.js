import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

import {
  Announcement, AcademicVicePrincipal, AccountingOfficer, ActivityOfficer, CommunicationOfficer,
  InstructionOfficer, Instructor, Librarian, Principal, RegistrationOfficer, StudentParent
} from "./boards/index";

const Home = () => {

  useEffect(() => {
    document.title = 'TOCS - Home';
  });

  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const hasRole = (role) => currentUser.roles && (currentUser.roles.includes(role) || currentUser.roles.includes('Super User'));

  function GetBoard() {
    return currentUser && (
      <>
        <div className="container">
          <div className="card-deck justify-content-center justify-content-xl-start">
            {hasRole('Principal') && (<Principal />)}
            {hasRole('Academic Vice Principal') && (<AcademicVicePrincipal />)}
            {hasRole('Registration Officer') && (<RegistrationOfficer />)}
            {hasRole('Accounting Officer') && (<AccountingOfficer />)}
            {hasRole('Activity Officer') && (<ActivityOfficer />)}
            {hasRole('Communication Officer') && (<CommunicationOfficer />)}
            {hasRole('Instruction Officer') && (<InstructionOfficer />)}
            {hasRole('Librarian') && (<Librarian />)}
            {hasRole('Instructor') && (<Instructor />)}
            <Announcement />
          </div>
        </div>
        { hasRole('Student Parent') && (<StudentParent />)}
      </>
    );
  }

  return (<GetBoard />);
};

export default Home;