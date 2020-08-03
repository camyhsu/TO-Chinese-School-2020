import React from 'react';
import PersonalDetails from '../components/PersonalDetails';
import FamilyDetails from '../components/FamilyDetails';
import StudentDetails from '../components/StudentDetails';
import { useAppContext } from '../libs/contextLib';


export default function RegistrationHomePage() {
    const { status } = useAppContext();


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
                <button>Register for 2020-2021 School Year</button>
                <button>Withdraw from 2020-2021 School Year</button>
            </div>
        </>
    )
};