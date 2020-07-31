import React from 'react';

const StudentDetails = ({student_details}) => {
    return (
        <>
            {student_details.map((details, key) => (
                <div className = "details" key={key}>
                    <p>Chinese Name: {details.chinese_name}</p>
                    <p>English Name: {details.english_name}</p>
                    <p>Gender: {details.gender}</p>
                    <p>Birth Date (MM/YYYY): {details.birth_month}/{details.birth_year}</p>
                    <p>Native Language: {details.native_language}</p>
                    <button>Edit Details</button>
                </div>
            ))}
        </>
    );
};

export default StudentDetails;