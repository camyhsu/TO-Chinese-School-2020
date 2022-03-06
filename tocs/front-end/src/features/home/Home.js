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
} from "../../components/boards";
import { Role, userHasRequiredRole } from "../../app/Role";
import { UserStatus } from "../user/UserStatus";

export const Home = () => {
  const { status, user } = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "TOCS - Home";
  }, []);

  if (status !== UserStatus.SIGNED_IN) {
    return <Navigate to="/sign-in" />;
  }

  const hasRole = (roles) => userHasRequiredRole(user.roles, roles);

  return (
    <>
      <div className="container">
        <div className="card-deck justify-content-center justify-content-xl-start">
          {hasRole([Role.PRINCIPAL]) && <Principal />}
          {hasRole([Role.ACADEMIC_VICE_PRINCIPAL]) && <AcademicVicePrincipal />}
          {hasRole([Role.REGISTRATION_OFFICER]) && <RegistrationOfficer />}
          {hasRole([Role.ACCOUNTING_OFFICER]) && <AccountingOfficer />}
          {hasRole([Role.ACTIVITY_OFFICER]) && <ActivityOfficer />}
          {hasRole([Role.COMMUNICATION_OFFICER]) && <CommunicationOfficer />}
          {hasRole([Role.INSTRUCTION_OFFICER]) && <InstructionOfficer />}
          {hasRole([Role.LIBRARIAN]) && <Librarian />}
          {hasRole([Role.INSTRUCTOR]) && <Instructor />}
          {/* Need a PVA board {hasRole([Role.PVA]) }*/}
          <Announcement />
        </div>
      </div>
      {hasRole([Role.STUDENT_PARENT]) && <StudentParent />}
    </>
  );
};
