import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";

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

import { ConsentRelease, Payment } from "./components/student";
import { TopNavbar } from "./app/TopNavbar";
import { Footer } from "./app/Footer";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.user);
  console.log(`In App.js currentUser => ${currentUser}`);

  useEffect(() => {
    if (currentUser) {
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <div>
        {currentUser && <TopNavbar />}
        <div
          className={`container mt-3 ${currentUser ? "container-main" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="/librarian/books" element={<Books />} />
            <Route
              path="/librarian/search-students"
              element={<SearchStudentsByRegistrationDates />}
            />
            <Route
              path="/librarian/books/read-only"
              element={<Books readOnly={true} />}
            />
            <Route
              path="/accounting/in-person-registration-payments"
              element={<InPersonRegistrationPayments />}
            />
            <Route
              path="/accounting/instructor-discount"
              element={<InstructorDiscount />}
            />
            <Route
              path="/accounting/charges-collected/:schoolYearId/:schoolYearName"
              element={<ChargesCollected />}
            />
            <Route
              path="/accounting/daily-registration-summary/:schoolYearId/:schoolYearName"
              element={<DailyRegistrationSummary />}
            />
            <Route
              path="/accounting/manual-transactions"
              element={<ManualTransactions />}
            />
            <Route
              path="/accounting/withdraw-request/:requestId"
              element={<WithdrawRequestDetails />}
            />
            <Route path="/admin/grades" element={<Grades />} />
            <Route path="/admin/school-classes" element={<SchoolClasses />} />
            <Route path="/admin/school-years" element={<SchoolYears />} />
            <Route
              path="/admin/school-year-details/:schoolYearId"
              element={<SchoolYearDetails />}
            />
            <Route
              path="/admin/manage-staff-assignments"
              element={<ManageStaffAssignments />}
            />
            <Route
              path="/admin/manage-staff-assignment/:schoolYearId"
              element={<ManageStaffAssignment />}
            />
            <Route
              path="/admin/withdraw-requests"
              element={<WithdrawRequests />}
            />
            <Route
              path="/registration/active-school-classes/:schoolYearId"
              element={<ActiveSchoolClasses />}
            />
            <Route
              path="/registration/school-classes/grade-student-count/:schoolYearId"
              element={<ActiveSchoolClassGradeCount />}
            />
            <Route
              path="/registration/school-classes/student-count/:classType/:schoolYearId"
              element={<SchoolClassCount />}
            />
            <Route
              path="/registration/instructor-assignment/:personId/:instructorAssignmentId"
              element={<InstructorAssignmentForm />}
            />
            <Route
              path="/registration/student-class-assignments"
              element={<ListActiveStudentsByName />}
            />
            <Route path="/registration/family/:familyId" element={<Family />} />
            <Route path="/registration/people" element={<People />} />
            <Route
              path="/registration/show-person/:personId"
              element={<PersonDetails />}
            />
            <Route
              path="/registration/sibling-in-same-grade/:schoolYearId"
              element={<SiblingInSameGrade />}
            />
            <Route
              path="/student/consent-release"
              element={<ConsentRelease />}
            />
            <Route path="/student/payment" element={<Payment />} />
            <Route
              path="/student/registration-payment/:viewType/:paymentId"
              element={<RegistrationPayment />}
            />
            <Route
              path="/instruction/active-school-classes"
              element={<ActiveSchoolClassesForInstructionOfficer />}
            />
            <Route
              path="/instruction/school-classes/:schoolClassId/:schoolYearId"
              element={<SchoolClassStudents />}
            />

            {/* Forms */}
            <Route
              path="/address-form/:addressId/:personId/:familyId/:forRegistrationStaff"
              element={<AddressForm />}
            />
            <Route
              path="/accounting/manual-transaction/:personId"
              element={<ManualTransactionForm />}
            />
            <Route
              path="/book-charge-form/:schoolYearId"
              element={<BookChargeForm />}
            />
            <Route path="/book-form/:bookId" element={<BookForm />} />
            <Route
              path="/change-password-form"
              element={<ChangePasswordForm />}
            />
            <Route
              path="/librarian/checkout-history/:bookId"
              element={<CheckoutHistoryForm />}
            />
            <Route path="/new-family-form" element={<NewFamilyForm />} />
            <Route
              path="/person-form/:personId/:familyId/:isParentTwo/:forRegistrationStaff"
              element={<PersonForm />}
            />
            <Route
              path="/school-class-form/:schoolClassId"
              element={<SchoolClassForm />}
            />
            <Route
              path="/school-year-form/:schoolYearId"
              element={<SchoolYearForm />}
            />
            <Route
              path="/student-registration/:schoolYearId"
              element={<StudentRegistrationForm />}
            />

            {/* Static pages */}
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/waiver" element={<Waiver />} />
          </Routes>
        </div>
      </div>
      {currentUser && <Footer />}
    </BrowserRouter>
  );
};

export default App;
