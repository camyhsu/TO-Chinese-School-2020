import React from 'react';
import PersonDetails from '../components/PersonDetails';
import FamilyDetails from '../components/FamilyDetails';
import StudentDetails from '../components/StudentDetails';

const RegistrationHomePage = () => (
    <>
        <div id="home">
            <button>Create a New Family</button>
            <br></br>
                <PersonDetails person_details={andrew_details}/>
            <hr></hr>
                <FamilyDetails person_details={andrew_details} family_details={andrew_family_details}/>
            <hr></hr>
            <h3>Student Details</h3>
                {student_details.map((details, key) => (
                    <div key={key}>
                        <StudentDetails student_details={details}/>
                        <hr id="student-break"></hr>
                    </div>
                ))}
            <hr></hr>
            <button>Withdraw from 2020-2021 School Year</button>
        </div>
    </>
);

export default RegistrationHomePage;