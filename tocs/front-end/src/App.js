import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Switch, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Account from './components/Account';
import ChargesCollected from './components/accounting/ChargesCollected';
import InstructorDiscount from './components/accounting/InstructorDiscount';
import Privacy from './components/Privacy';
import RegistrationPayment from './components/student/RegistrationPayment';
import TransactionHistory from './components/TransactionHistory';
import Waiver from './components/Waiver';
import Contact from './components/Contact';
import ActiveSchoolClassesForInstructionOfficer from './components/ActiveSchoolClassesForInstructionOfficer';
import { AddressForm, BookChargeForm, BookForm, CheckoutHistoryForm, NewFamilyForm, PersonForm, SchoolClassForm, SchoolYearForm } from './components/forms/index';
import ChangePasswordForm from './components/ChangePasswordForm';
import { Books } from './components/librarian/index';
import {
  ActiveSchoolClasses, ActiveSchoolClassGradeCount, Family,
  Grades, ManageStaffAssignments, ManageStaffAssignment, People, PersonDetails,
  SchoolClasses, SchoolYears, SchoolYearDetails, SiblingInSameGrade
} from './components/registration/index';

import { logout } from './actions/auth.action';
import { clearMessage } from './actions/message.action';

import { history } from './helpers/history';

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {

    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        {currentUser && (
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <span className="navbar-brand">TOCS</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="true" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse" id="navbarCollapse">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/home"} className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to={"/transaction-history"} className="nav-link">Transaction History</Link>
                </li>
                <li className="nav-item">
                  <Link to={"/account"} className="nav-link">Account</Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>Sign Out</a>
                </li>
              </ul>
            </div>
          </nav>
        )}

        <div className={`container mt-3 ${currentUser ? "container-main" : ""}`}>
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/transaction-history" component={TransactionHistory} />

            <Route exact path="/librarian/books" component={Books} />
            <Route exact path="/librarian/books/read-only" component={() => <Books readOnly={true} />} />
            <Route exact path="/accounting/instructor-discount" component={InstructorDiscount} />
            <Route exact path="/accounting/charges-collected" component={ChargesCollected} />
            <Route exact path="/admin/grades" component={Grades} />
            <Route exact path="/admin/school-classes" component={SchoolClasses} />
            <Route exact path="/admin/school-years" component={SchoolYears} />
            <Route exact path="/admin/school-year-details" component={SchoolYearDetails} />
            <Route exact path="/admin/manage-staff-assignments" component={ManageStaffAssignments} />
            <Route exact path="/admin/manage-staff-assignment" component={ManageStaffAssignment} />
            <Route exact path="/registration/active-school-classes" component={ActiveSchoolClasses} />
            <Route exact path="/registration/active_school_classes/grade_student_count" component={ActiveSchoolClassGradeCount} />
            <Route exact path="/registration/family" component={Family} />
            <Route exact path="/registration/people" component={People} />
            <Route exact path="/registration/show-person" component={PersonDetails} />
            <Route exact path="/registration/sibling-in-same-grade" component={SiblingInSameGrade} />
            <Route exact path="/student/registration-payment" component={RegistrationPayment} />
            <Route exact path="/instruction/active-school-classes" component={ActiveSchoolClassesForInstructionOfficer} />

            {/* Forms */}
            <Route exact path="/address-form" component={AddressForm} />
            <Route exact path="/book-charge-form" component={BookChargeForm} />
            <Route exact path="/book-form" component={BookForm} />
            <Route exact path="/change-password-form" component={ChangePasswordForm} />
            <Route exact path="/librarian/checkout-history" component={CheckoutHistoryForm} />
            <Route exact path="/new-family-form" component={NewFamilyForm} />
            <Route exact path="/person-form" component={PersonForm} />
            <Route exact path="/school-class-form" component={SchoolClassForm} />
            <Route exact path="/school-year-form" component={SchoolYearForm} />

            {/* Static pages */}
            <Route exact path="/contact-us" component={Contact} />
            <Route exact path="/privacy-policy" component={Privacy} />
            <Route exact path="/waiver" component={Waiver} />
          </Switch>
        </div>
      </div>
      {currentUser && (
        <footer className="footer--sticky">
          <div className="container mw-100">
            <div className="row">
              <div className="col-ms-1 ml-3"><Link to={"/privacy-policy"}>Privacy Policy</Link></div>
              <div className="col-ms-10 mr-auto ml-3"><Link to={"/waiver"}>Waiver</Link></div>
              <div className="col-ms-1 mr-3"><Link to={"/contact-us"}>Contact Us</Link></div>
            </div>
          </div>
        </footer>
      )}
    </Router>
  );
};

export default App;