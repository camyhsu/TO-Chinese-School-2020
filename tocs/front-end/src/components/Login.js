import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Card, CardBody, CardFooter } from "./Cards";
import { required } from "../utils/utilities";

import { userSignIn } from "../features/user/userSlice";

const Login = () => {
  useEffect(() => {
    document.title = "TOCS - Sign In";
  }, []);

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { status } = useSelector((state) => state.user);
  //const { message } = useSelector((state) => state.message);
  const message = false;

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(userSignIn({ username: username, password: password }));
    } else {
      setLoading(false);
    }
  };

  console.log(`About to check status => ${status}`);
  if (status === "signInSucceeded") {
    console.log(`status check => ${status}`);
    return <Navigate to="/home" />;
  }

  return (
    <Card>
      <CardBody>
        <img
          src="transparent-tree.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm" />}
              <span>Sign In</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </CardBody>
      <CardFooter>
        <div className="">
          Don't have an account? <Link to={"/register"}>Register</Link>
        </div>
        <div className="">
          <a href="#123">Forgot your password?</a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Login;
