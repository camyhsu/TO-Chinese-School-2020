import React from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function FamilyDetails() {
    const { userData } = useAppContext();

    const history = useHistory();

    function editFamilyAddress() {
        history.push('/registration/familyaddress/edit');
    }

    return (
        <>
            <div className = "details">
                <h3>Family for {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</h3>
                <p>Parent One: {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</p>
                <p>Parent Two: {userData.family.parentTwoChineseName} ({userData.family.parentTwoEnglishName})</p>
                <p>Children: {userData.family.children.join(", ")}</p>
                <p>Address: {userData.family.street}, {userData.family.city}, {userData.family.state} {userData.family.zipcode}</p>
                <p>Home Phone: {userData.family.homePhone == null ? '' : userData.family.homePhone}</p>
                <p>Cell Phone: {userData.family.cellPhone == null ? '' : userData.family.cellPhone}</p>
                <p>Email: {userData.family.email == null ? '' : userData.family.email}</p>
                <Button onClick={editFamilyAddress}>Edit Family Address</Button>
                <br></br>
                <br></br>
                <button>Add a Child</button>
            </div>
        </>
    )
};