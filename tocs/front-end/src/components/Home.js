import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

import StudentParent from "./boards/StudentParent";

const Home = () => {

  useEffect(() => {
    document.title = "TOCS - Home";
  });

  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  
  const currentRole = currentUser.roles && currentUser.roles[0];

  function GetBoard() {
    if (currentRole === 'Student Parent') {
      return <StudentParent/>;
    }
  }

  return (<GetBoard/>);
};

export default Home;