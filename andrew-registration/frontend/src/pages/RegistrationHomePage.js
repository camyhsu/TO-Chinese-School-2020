import React from 'react';
import PersonDetails from '../components/PersonDetails';
import FamilyDetails from '../components/FamilyDetails';
import StudentDetails from '../components/StudentDetails';

const RegistrationHomePage = () => (
    <>
        <div id="home">
            <button>Create a New Family</button>
            <br></br>
                <PersonDetails />
            <hr></hr>
                <FamilyDetails />
            <hr></hr>
                <StudentDetails />
            <hr></hr>
            <button>Withdraw from 2020-2021 School Year</button>
        </div>
    </>
);

export default RegistrationHomePage;