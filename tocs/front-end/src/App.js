import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Account from "./components/Account";
import {
  ChargesCollected,
  InstructorDiscount,
  DailyRegistrationSummary,
  ManualTransactions,
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
  ManualTransactionForm,
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

import { logout } from "./actions/auth.action";

import { ConsentRelease, Payment } from "./components/student";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <BrowserRouter>
      <div>
        {currentUser && (
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <span className="navbar-brand">TOCS</span>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="true"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse" id="navbarCollapse">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/home"} className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/transaction-history"} className="nav-link">
                    Transaction History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/account"} className="nav-link">
                    Account
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <div
          className={`container mt-3 ${currentUser ? "container-main" : ""}`}
        >
          <Switch>
            <Route exact path={["/", "/home"]}>
              <Home />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/account">
              <Account />
            </Route>
            <Route exact path="/transaction-history">
              <TransactionHistory />
            </Route>
            <Route exact path="/librarian/books">
              <Books />
            </Route>
            <Route exact path="/librarian/search-students">
              <SearchStudentsByRegistrationDates />
            </Route>
            <Route exact path="/librarian/books/read-only">
              <Books readOnly={true} />
            </Route>
            <Route exact path="/accounting/in-person-registration-payments">
              <InPersonRegistrationPayments />
            </Route>
            <Route exact path="/accounting/instructor-discount">
              <InstructorDiscount />
            </Route>
            <Route path="/accounting/charges-collected/:schoolYearId/:schoolYearName">
              <ChargesCollected />
            </Route>
            <Route path="/accounting/daily-registration-summary/:schoolYearId/:schoolYearName">
              <DailyRegistrationSummary />
            </Route>
            <Route exact path="/accounting/manual-transactions">
              <ManualTransactions />
            </Route>
            <Route path="/accounting/withdraw-request/:requestId">
              <WithdrawRequestDetails />
            </Route>
            <Route exact path="/admin/grades">
              <Grades />
            </Route>
            <Route exact path="/admin/school-classes">
              <SchoolClasses />
            </Route>
            <Route exact path="/admin/school-years">
              <SchoolYears />
            </Route>
            <Route path="/admin/school-year-details/:schoolYearId">
              <SchoolYearDetails />
            </Route>
            <Route exact path="/admin/manage-staff-assignments">
              <ManageStaffAssignments />
            </Route>
            <Route path="/admin/manage-staff-assignment/:schoolYearId">
              <ManageStaffAssignment />
            </Route>
            <Route exact path="/admin/withdraw-requests">
              <WithdrawRequests />
            </Route>
            <Route path="/registration/active-school-classes/:schoolYearId">
              <ActiveSchoolClasses />
            </Route>
            <Route path="/registration/school-classes/grade-student-count/:schoolYearId">
              <ActiveSchoolClassGradeCount />
            </Route>
            <Route path="/registration/school-classes/student-count/:classType/:schoolYearId">
              <SchoolClassCount />
            </Route>
            <Route path="/registration/instructor-assignment/:personId/:instructorAssignmentId">
              <InstructorAssignmentForm />
            </Route>
            <Route exact path="/registration/student-class-assignments">
              <ListActiveStudentsByName />
            </Route>
            <Route path="/registration/family/:familyId">
              <Family />
            </Route>
            <Route exact path="/registration/people">
              <People />
            </Route>
            <Route path="/registration/show-person/:personId">
              <PersonDetails />
            </Route>
            <Route path="/registration/sibling-in-same-grade/:schoolYearId">
              <SiblingInSameGrade />
            </Route>
            <Route exact path="/student/consent-release">
              <ConsentRelease />
            </Route>
            <Route exact path="/student/payment">
              <Payment />
            </Route>
            <Route path="/student/registration-payment/:viewType/:paymentId">
              <RegistrationPayment />
            </Route>
            <Route exact path="/instruction/active-school-classes">
              <ActiveSchoolClassesForInstructionOfficer />
            </Route>
            <Route path="/instruction/school-classes/:schoolClassId/:schoolYearId">
              <SchoolClassStudents />
            </Route>

            {/* Forms */}
            <Route path="/address-form/:addressId/:personId/:familyId/:forRegistrationStaff">
              <AddressForm />
            </Route>
            <Route path="/accounting/manual-transaction/:personId">
              <ManualTransactionForm />
            </Route>
            <Route path="/book-charge-form/:schoolYearId">
              <BookChargeForm />
            </Route>
            <Route path="/book-form/:bookId">
              <BookForm />
            </Route>
            <Route exact path="/change-password-form">
              <ChangePasswordForm />
            </Route>
            <Route path="/librarian/checkout-history/:bookId">
              <CheckoutHistoryForm />
            </Route>
            <Route exact path="/new-family-form">
              <NewFamilyForm />
            </Route>
            <Route path="/person-form/:personId/:familyId/:isParentTwo/:forRegistrationStaff">
              <PersonForm />
            </Route>
            <Route path="/school-class-form/:schoolClassId">
              <SchoolClassForm />
            </Route>
            <Route path="/school-year-form/:schoolYearId">
              <SchoolYearForm />
            </Route>
            <Route path="/student-registration/:schoolYearId">
              <StudentRegistrationForm />
            </Route>

            {/* Static pages */}
            <Route exact path="/contact-us">
              <Contact />
            </Route>
            <Route exact path="/privacy-policy">
              <Privacy />
            </Route>
            <Route exact path="/waiver">
              <Waiver />
            </Route>
          </Switch>
        </div>
      </div>
      {currentUser && (
        <footer className="footer--sticky">
          <div className="container mw-100">
            <div className="row">
              <div className="col-ms-1 ml-3">
                <Link to={"/privacy-policy"}>Privacy Policy</Link>
              </div>
              <div className="col-ms-10 mr-auto ml-3">
                <Link to={"/waiver"}>Waiver</Link>
              </div>
              <div className="col-ms-1 mr-3">
                <Link to={"/contact-us"}>Contact Us</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </BrowserRouter>
  );
};

export default App;
