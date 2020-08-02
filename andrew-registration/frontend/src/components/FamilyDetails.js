import React from 'react';
import { useAppContext } from '../libs/contextLib';

export default function FamilyDetails() {
    const { userData } = useAppContext();

    return (
        <>
            <div className = "details">
                <h3>Family for {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</h3>
                <p>Parent One: {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</p>
                <p>Parent Two: {userData.family.parentTwoChineseName} ({userData.family.parentTwoEnglishName})</p>
                <p>Children: {userData.family.children.join(", ")}</p>
                <p>Address: {userData.person.address == 'null, null, null null' ? '' : userData.person.address}</p>
                <p>Home Phone: {userData.person.homePhone == null ? '' : userData.person.homePhone}</p>
                <p>Cell Phone: {userData.person.cellPhone == null ? '' : userData.person.cellPhone}</p>
                <p>Email: {userData.person.email == null ? '' : userData.person.email}</p>
                <button>Edit Details</button>
                <br></br>
                <br></br>
                <button>Add a Child</button>
            </div>
        </>
    )
};