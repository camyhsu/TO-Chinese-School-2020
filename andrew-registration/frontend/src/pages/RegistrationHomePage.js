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
                <button>Create a New Family</button>
                <br></br>
                    <PersonalDetails />
                <hr></hr>
                    <FamilyDetails />
                <hr></hr>
                    <StudentDetails />
                <hr></hr>
                <button>Withdraw from 2020-2021 School Year</button>
            </div>
        </>
    )
};