import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';

export default function RegistrationSideBar() {
    const { userHasAuthenticated, userData, setStatus } = useAppContext();

    function handleSignOut() {
        userHasAuthenticated(false);
    }

    function handleHome() {
        setStatus('');
    }

    return (
        <>
            <div id="side-bar">
                <p>Welcome, {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</p>
                <Link to='/registration' onClick={handleHome}>Home</Link>
                <Link to='/1'>Contact Us</Link>
                <Link to='/2'>Privacy Policy</Link>
                <Link to='/3'>Waiver</Link>
                <Link to='/4'>Transaction History</Link>
                <Link to='/5'>Change Password</Link>
                <Link to='/' onClick={handleSignOut}>Sign Out</Link>
            </div>  
        </>
    )
};
   