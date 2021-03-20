import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Account from "./components/Account";
import Privacy from "./components/Privacy";
import Waiver from "./components/Waiver";
import Contact from "./components/Contact";
import PersonForm from "./components/PersonForm";
import AddressForm from "./components/AddressForm";

import { logout } from "./actions/auth.action";
import { clearMessage } from "./actions/message.action";

import { history } from "./helpers/history";

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
      // setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
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
            <Route exact path="/privacy-policy" component={Privacy} />
            <Route exact path="/waiver" component={Waiver} />
            <Route exact path="/contact-us" component={Contact} />
            <Route exact path="/person-form" component={PersonForm} />
            <Route exact path="/address-form" component={AddressForm} />
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