import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Card, CardBody, CardFooter, CardTitle } from "../../components/Cards";
import {
  OptionalFieldMark,
  ProgressSpinner,
} from "../../components/decorationElements";
import { ContactEmails } from "../../utils/ContactEmails";
import {
  birthYearValidation,
  emailValidation,
  passwordValidation,
  phoneNumberValidation,
  requiredOnly,
  trimOnly,
  trimAndRequired,
  zipcodeValidation,
  usernameValidation,
} from "../../utils/formFieldOptions";
import { SignUpStatus, userSignUp } from "./signUpApiClient";

export const SignUp = () => {
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "TOCS - Sign Up";
  }, []);

  const [signUpStatus, setSignUpStatus] = useState(SignUpStatus.IDLE);

  const submitHandler = async (data) => {
    setSignUpStatus(SignUpStatus.PENDING);
    const signUpData = { ...data };
    delete signUpData.confirmPassword;
    const responseFromServer = await userSignUp(signUpData);
    setSignUpStatus(responseFromServer);
  };

  if (signUpStatus === SignUpStatus.SIGN_UP_SUCCESSFUL) {
    return (
      <Card size="large">
        <CardBody>
          <img
            src="/transparent-tree.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <div>
            <p className="mt-3">
              User account sign-up successful. Please sign-in{" "}
              <Link to={"/sign-in"}>Here</Link> using your new user.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const signUpFailed =
    signUpStatus === SignUpStatus.EMAIL_CONFLICT ||
    signUpStatus === SignUpStatus.USERNAME_CONFLICT ||
    signUpStatus === SignUpStatus.SIGN_UP_FAILED;

  let signUpErrorMessage = null;
  if (signUpFailed) {
    if (signUpStatus === SignUpStatus.EMAIL_CONFLICT) {
      signUpErrorMessage = `Sign Up Failed - email address matches an existing account - please contact ${ContactEmails.WEB_SITE_SUPPORT} to recover your account`;
    } else if (signUpStatus === SignUpStatus.USERNAME_CONFLICT) {
      signUpErrorMessage =
        "Sign Up Failed - username matches an existing account - please choose a different username";
    } else {
      signUpErrorMessage = "Server Unavailable - please try again later";
    }
  }

  return (
    <Card size="large">
      <CardBody>
        <img
          src="/transparent-tree.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <div>
          <p className="text-danger mt-3">
            <span className="font-weight-bold">
              Families with existing or prior students in Thousand Oaks Chinese
              School
            </span>{" "}
            - Please contact {ContactEmails.WEB_SITE_SUPPORT} with your
            information if you have troubles recovering your username or
            password. Do not use the form below to create a new user.
          </p>
          <p>
            For a new family who has not attend Thousand Oaks Chinese School
            before, please fill out the form below to create a new user account.
          </p>
          <p>
            Please note that information collected below is for the family and
            the parent who would be managing the account, not the prospective
            student. Once the account is established, student information could
            be entered when signed-in with the new user.
          </p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <CardTitle clazz="mt-5">Parent One</CardTitle>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="firstName">English First Name</label>
                <input
                  {...register("firstName", trimAndRequired)}
                  type="text"
                  placeholder="First Name"
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="lastName">English Last Name</label>
                <input
                  {...register("lastName", trimAndRequired)}
                  type="text"
                  placeholder="Last Name"
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="chineseName">
                  Chinese Name <OptionalFieldMark />
                </label>
                <input
                  {...register("chineseName", trimOnly)}
                  type="text"
                  placeholder="中文姓名"
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="nativeLanguage">Native Language</label>
                <select
                  {...register("nativeLanguage")}
                  className="form-control"
                >
                  <option value="Mandarin">Mandarin</option>
                  <option value="English">English</option>
                  <option value="Cantonese">Cantonese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="gender">Gender</label>
                <select {...register("gender")} className="form-control">
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="birthMonth">
                  Birth Month <OptionalFieldMark />
                </label>
                <select {...register("birthMonth")} className="form-control">
                  <option value=""></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="birthYear">
                  Birth Year <OptionalFieldMark />
                </label>
                <input
                  {...register("birthYear", birthYearValidation)}
                  type="number"
                  placeholder="YYYY"
                  className={`form-control ${
                    errors.birthYear ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.birthYear?.message}
                </div>
              </div>
            </div>
            <CardTitle clazz="mt-5">Family Address</CardTitle>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="street">Street</label>
                <input
                  {...register("street", trimAndRequired)}
                  type="text"
                  placeholder="Street"
                  className={`form-control ${
                    errors.street ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">{errors.street?.message}</div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="city">City</label>
                <input
                  {...register("city", trimAndRequired)}
                  type="text"
                  placeholder="City"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.city?.message}</div>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="state">State</label>
                <select {...register("state")} className="form-control">
                  <option value="CA">California</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group col-md-4 mb-3">
                <label htmlFor="zipcode">Zipcode</label>
                <input
                  {...register("zipcode", zipcodeValidation)}
                  type="text"
                  placeholder="zipcode"
                  className={`form-control ${
                    errors.zipcode ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.zipcode?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="homePhone">Home Phone Number</label>
                <input
                  {...register("homePhone", {
                    ...requiredOnly,
                    ...phoneNumberValidation,
                  })}
                  type="tel"
                  placeholder="555-555-5555"
                  className={`form-control ${
                    errors.homePhone ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.homePhone?.message}
                </div>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="cellPhone">
                  Second Phone Number <OptionalFieldMark />
                </label>
                <input
                  {...register("cellPhone", phoneNumberValidation)}
                  type="tel"
                  placeholder="333-333-3333"
                  className={`form-control ${
                    errors.cellPhone ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.cellPhone?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="email">Email Address</label>
                <input
                  {...register("email", emailValidation)}
                  type="email"
                  placeholder="somebody@example.com"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
            </div>
            <CardTitle clazz="mt-5">New Username and Password</CardTitle>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="username">Username</label>
                <input
                  {...register("username", usernameValidation)}
                  type="text"
                  placeholder="username"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.username?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="password">Password</label>
                <input
                  {...register("password", passwordValidation)}
                  type="password"
                  placeholder="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="confirmPassword">Re-type Password</label>
                <input
                  {...register("confirmPassword", {
                    required: "Required!",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Password does not match!",
                  })}
                  type="password"
                  placeholder="password again"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mt-5 mb-3">
                <button className="btn btn-primary btn-block">
                  {signUpStatus === SignUpStatus.PENDING && <ProgressSpinner />}
                  <span>Create User</span>
                </button>
              </div>
            </div>
            <div className="form-group">
              {signUpFailed && (
                <div className="alert alert-danger" role="alert">
                  {signUpErrorMessage}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardBody>
      <CardFooter>
        Back to <Link to={"/sign-in"}>Sign In</Link>
      </CardFooter>
    </Card>
  );
};
