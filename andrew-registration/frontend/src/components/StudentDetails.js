import React from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function StudentDetails() {
    const { userData } = useAppContext();

    const history = useHistory();

    function editStudentDetails(id) {
        history.push(`/registration/student/edit/${id}`);
    }

    return (
        userData.students == null ? null :
        <>
            <h3>Student Information</h3>
            {userData.students.map((details, key) => (
                <div className = "details" key={key}>
                    <p>Chinese Name: {details.chinese_name}</p>
                    <p>English Name: {details.english_first_name} {details.english_last_name}</p>
                    <p>Gender: {details.gender}</p>
                    <p>Birth Date (MM/YYYY): {details.birth_month}/{details.birth_year}</p>
                    <p>Native Language: {details.native_language}</p>
                    <Button onClick={() => editStudentDetails(key)}>Edit Student Details</Button>
                    <hr id="student-break"></hr>
                </div>
            ))}
        </>
    )
};