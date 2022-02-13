import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
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
  );
};
