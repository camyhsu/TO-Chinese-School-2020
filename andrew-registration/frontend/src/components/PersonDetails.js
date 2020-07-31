import React from 'react';
import { useAppContext } from '../libs/contextLib';

export default function PersonDetails() {
    const { userData } = useAppContext();

    console.log(userData);
    return (
        <>
            <div className = "details">
                <h3>Person</h3>
                <p>Chinese Name: {userData.person.chineseName == null ? '' : userData.person.chineseName}</p>
                <p>English Name: {userData.person.englishName == null ? '' : userData.person.englishName}</p>
                <p>Gender: {userData.person.gender == null ? '' : userData.person.gender}</p>
                <p>Birth Date (MM/YYYY): {userData.person.birthMonthYear === 'null/null' ? '' : userData.person.birthMonthYear}</p>
                <p>Native Language: {userData.person.nativeLanguage == null ? '' : userData.person.nativeLanguage}</p>
                <p>Address: {userData.person.address == 'null, null, null null' ? '' : userData.person.address}</p>
                <p>Home Phone: {userData.person.homePhone == null ? '' : userData.person.homePhone}</p>
                <p>Cell Phone: {userData.person.cellPhone == null ? '' : userData.person.cellPhone}</p>
                <p>Email: {userData.person.email == null ? '' : userData.person.email}</p>
                <button>Edit Details</button>
            </div>
        </>
    )
};