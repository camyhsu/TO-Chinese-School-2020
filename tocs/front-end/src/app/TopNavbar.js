import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth.action";

export const TopNavbar = () => {
  const dispatch = useDispatch();

  const signOutHandler = () => dispatch(logout());

  return (
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
        <span className="navbar-toggler-icon" />
      </button>
      <div className="navbar-collapse collapse" id="navbarCollapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transaction-history" className="nav-link">
              Transaction History
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/account" className="nav-link">
              Account
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={signOutHandler}>
              Sign Out
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};