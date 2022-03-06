import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { Card, CardBody, CardFooter } from "../../components/Cards";
import { userSignIn } from "./userSlice";
import { UserStatus } from "./UserStatus";

export const SignIn = () => {
  const { error: signInError, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "TOCS - Sign In";
  }, []);

  const submitHandler = (data) => {
    dispatch(userSignIn(data));
  };

  if (status === UserStatus.SIGNED_IN) {
    console.log("In SignIn page - already signed in - redirecting to home");
    return <Navigate to="/home" />;
  }

  const signInPending = status === UserStatus.PENDING;
  const signInFailed = status === UserStatus.SIGNED_IN_FAILED;

  return (
    <Card>
      <CardBody>
        <img
          src="/transparent-tree.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block">
              {signInPending && (
                <span className="spinner-border spinner-border-sm" />
              )}
              <span>Sign In</span>
            </button>
          </div>
          <div className="form-group">
            {signInFailed && (
              <div className="alert alert-danger" role="alert">
                {signInError}
              </div>
            )}
          </div>
        </form>
      </CardBody>
      <CardFooter>
        <div className="">
          <a href="#placeholder">Forgot username?</a>
        </div>
        <div className="">
          <a href="#placeholder">Forgot password?</a>
        </div>
        <div className="">
          Don't have a user account?
          <br />
          <Link to={"/register"}>Sign up for a new user account</Link>
        </div>
      </CardFooter>
    </Card>
  );
};
