import React from 'react';
import PersonalDetails from '../components/user/PersonalDetails';
import FamilyDetails from '../components/user/FamilyDetails';
import StudentDetails from '../components/user/StudentDetails';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function RegistrationHomePage() {
    const { status } = useAppContext();
    const history = useHistory();

    function registerStudent() {
        history.push(`/registration/register/select`);
    }

    return (
        <>
            <p id="status">{status}</p>
            <div id="home">
                <PersonalDetails />
                <hr></hr>
                <FamilyDetails />
                <hr></hr>
                <StudentDetails />
                <hr></hr>
                <Button onClick={registerStudent}>Register for 2020-2021 School Year</Button>
                <button>Withdraw from 2020-2021 School Year</button>
            </div>
        </>
    )
};