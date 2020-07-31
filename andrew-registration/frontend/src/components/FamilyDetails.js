import React from 'react';

const FamilyDetails = ({person_details, family_details}) => {
    const person_name = person_details[0]['chinese_name'] +'(' + person_details[0]['english_name'] +')';
    return (
        <>
            {family_details.map((details, key) => (
                <div className = "details" key={key}>
                    <h3>Family for {person_name}</h3>
                    <p>Parent One: {details.parent_one_chinese} ({details.parent_one_english})</p>
                    <p>Parent Two: {details.parent_two_chinese} ({details.parent_two_english})</p>
                    <p>Children: {details.children.join(", ")}</p>
                    <p>Address: {details.address}</p>
                    <p>Home Phone: {details.home_phone}</p>
                    <p>Cell Phone: {details.cell_phone}</p>
                    <p>Email: {details.email}</p>
                    <button>Edit Details</button>
                    <br></br>
                    <br></br>
                    <button>Add a Child</button>
                </div>
            ))}
        </>
    );
};

export default FamilyDetails;