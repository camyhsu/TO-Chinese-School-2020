import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import { Home } from "./features/home/Home";
import Account from "./components/Account";
import {
  ChargesCollected,
  InstructorDiscount,
  DailyRegistrationSummary,
  InPersonRegistrationPayments,
  WithdrawRequestDetails,
  WithdrawRequests,
} from "./components/accounting";
import SchoolClassStudents from "./components/instruction/SchoolClassStudents";
import Privacy from "./components/Privacy";
import RegistrationPayment from "./components/student/RegistrationPayment";
import TransactionHistory from "./components/TransactionHistory";
import Waiver from "./components/Waiver";
import Contact from "./components/Contact";
import ActiveSchoolClassesForInstructionOfficer from "./components/ActiveSchoolClassesForInstructionOfficer";
import {
  InstructorAssignmentForm,
  AddressForm,
  BookChargeForm,
  BookForm,
  CheckoutHistoryForm,
  NewFamilyForm,
  PersonForm,
  SchoolClassForm,
  SchoolYearForm,
  StudentRegistrationForm,
} from "./components/forms/index";
import ChangePasswordForm from "./components/ChangePasswordForm";
import {
  Books,
  SearchStudentsByRegistrationDates,
} from "./components/librarian/index";
import {
  ActiveSchoolClasses,
  ActiveSchoolClassGradeCount,
  SchoolClassCount,
  Family,
  Grades,
  ListActiveStudentsByName,
  ManageStaffAssignments,
  ManageStaffAssignment,
  People,
  PersonDetails,
  SchoolClasses,
  SchoolYears,
  SchoolYearDetails,
  SiblingInSameGrade,
} from "./components/registration/index";

import { ConsentRelease, Payment } from "./components/student";
import { TopNavbar } from "./app/TopNavbar";
import { Footer } from "./app/Footer";
import { PrivateRoute } from "./app/PrivateRoute";
import { Role } from "./app/Role";
import { SignIn } from "./features/user/SignIn";
import { SignUp } from "./features/user/SignUp";
import { UserStatus } from "./features/user/UserStatus";

const App = () => {
  const { status } = useSelector((state) => state.user);
  const userSignedIn = status === UserStatus.SIGNED_IN;

  return (
    <BrowserRouter>
      <div>
        {userSignedIn && <TopNavbar />}
        <div
          className={`container mt-3 ${userSignedIn ? "container-main" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/transaction-history"
              element={
                <PrivateRoute requiredRoles={[Role.STUDENT_PARENT]}>
                  <TransactionHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/librarian/books"
              element={
                <PrivateRoute requiredRoles={[Role.LIBRARIAN]}>
                  <Books />
                </PrivateRoute>
              }
            />
            <Route
              path="/librarian/search-students"
              element={
                <PrivateRoute requiredRoles={[Role.LIBRARIAN]}>
                  <SearchStudentsByRegistrationDates />
                </PrivateRoute>
              }
            />
            <Route
              path="/librarian/books/read-only"
              element={
                <PrivateRoute requiredRoles={[Role.INSTRUCTOR]}>
                  <Books readOnly={true} />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounting/in-person-registration-payments"
              element={
                <PrivateRoute requiredRoles={[Role.ACCOUNTING_OFFICER]}>
                  <InPersonRegistrationPayments />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounting/instructor-discount"
              element={
                <PrivateRoute requiredRoles={[Role.ACCOUNTING_OFFICER]}>
                  <InstructorDiscount />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounting/charges-collected/:schoolYearId/:schoolYearName"
              element={
                <PrivateRoute requiredRoles={[Role.ACCOUNTING_OFFICER]}>
                  <ChargesCollected />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounting/daily-registration-summary/:schoolYearId/:schoolYearName"
              element={
                <PrivateRoute requiredRoles={[Role.ACCOUNTING_OFFICER]}>
                  <DailyRegistrationSummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/accounting/withdraw-request/:requestId"
              element={
                <PrivateRoute requiredRoles={[Role.ACCOUNTING_OFFICER]}>
                  <WithdrawRequestDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/grades"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <Grades />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/school-classes"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolClasses />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/school-years"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolYears />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/school-year-details/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolYearDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-staff-assignments"
              element={
                <PrivateRoute requiredRoles={[Role.PRINCIPAL]}>
                  <ManageStaffAssignments />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-staff-assignment/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.PRINCIPAL]}>
                  <ManageStaffAssignment />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/withdraw-requests"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <WithdrawRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/active-school-classes/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <ActiveSchoolClasses />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/school-classes/grade-student-count/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <ActiveSchoolClassGradeCount />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/school-classes/student-count/:classType/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolClassCount />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/instructor-assignment/:personId/:instructorAssignmentId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <InstructorAssignmentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/student-class-assignments"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <ListActiveStudentsByName />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/family/:familyId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <Family />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/people"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <People />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/show-person/:personId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <PersonDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration/sibling-in-same-grade/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SiblingInSameGrade />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/consent-release"
              element={
                <PrivateRoute requiredRoles={[Role.STUDENT_PARENT]}>
                  <ConsentRelease />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/payment"
              element={
                <PrivateRoute requiredRoles={[Role.STUDENT_PARENT]}>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/registration-payment/:viewType/:paymentId"
              element={
                <PrivateRoute requiredRoles={[Role.STUDENT_PARENT]}>
                  <RegistrationPayment />
                </PrivateRoute>
              }
            />
            <Route
              path="/instruction/active-school-classes"
              element={
                <PrivateRoute requiredRoles={[Role.INSTRUCTION_OFFICER]}>
                  <ActiveSchoolClassesForInstructionOfficer />
                </PrivateRoute>
              }
            />
            <Route
              path="/instruction/school-classes/:schoolClassId/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.INSTRUCTION_OFFICER]}>
                  <SchoolClassStudents />
                </PrivateRoute>
              }
            />

            {/* Forms */}
            <Route
              path="/address-form/:addressId/:personId/:familyId/:forRegistrationStaff"
              element={<AddressForm />}
            />
            <Route
              path="/book-charge-form/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <BookChargeForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/book-form/:bookId"
              element={
                <PrivateRoute requiredRoles={[Role.LIBRARIAN]}>
                  <BookForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/change-password-form"
              element={<ChangePasswordForm />}
            />
            <Route
              path="/librarian/checkout-history/:bookId"
              element={
                <PrivateRoute requiredRoles={[Role.LIBRARIAN]}>
                  <CheckoutHistoryForm />
                </PrivateRoute>
              }
            />
            <Route path="/new-family-form" element={<NewFamilyForm />} />
            <Route
              path="/person-form/:personId/:familyId/:isParentTwo/:forRegistrationStaff"
              element={<PersonForm />}
            />
            <Route
              path="/school-class-form/:schoolClassId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolClassForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/school-year-form/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.REGISTRATION_OFFICER]}>
                  <SchoolYearForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-registration/:schoolYearId"
              element={
                <PrivateRoute requiredRoles={[Role.STUDENT_PARENT]}>
                  <StudentRegistrationForm />
                </PrivateRoute>
              }
            />

            {/* Static pages */}
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/waiver" element={<Waiver />} />
          </Routes>
        </div>
      </div>
      {userSignedIn && <Footer />}
    </BrowserRouter>
  );
};

export default App;
