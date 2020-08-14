import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function FamilyDetails() {
    const { userData } = useAppContext();

    const history = useHistory();

    function editFamilyAddress() {
        history.push(`/registration/family/address/edit/${userData.person.personId}`);
    }

    function addChild() {
        history.push(`/registration/family/addchild/${userData.family.familyId}`);
    }


    return (
        <>
            <div className = "details">
                <h3>Family for {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</h3>
                <p>Parent One: {userData.parents.parentOneChineseName} ({userData.parents.parentOneEnglishName})</p>
                <p>Parent Two: {userData.parents.parentTwoChineseName} ({userData.parents.parentTwoEnglishName})</p>
                <p>Children: {userData.family.children.join(", ")}</p>
                <p>Address: {userData.family.street}, {userData.family.city}, {userData.family.state} {userData.family.zipcode}</p>
                <p>Home Phone: ({userData.family.homePhone.slice(0,3)}) {userData.family.homePhone.slice(3,6)}-{userData.family.homePhone.slice(6)}</p>
                {userData.family.cellPhone === '' ? <p>Cell Phone: </p> :  
                <p>Cell Phone: ({userData.family.cellPhone.slice(0,3)}) {userData.family.cellPhone.slice(3,6)}-{userData.family.cellPhone.slice(6)}</p>}
                <p>Email: {userData.family.email == null ? '' : userData.family.email}</p>
                <Button onClick={editFamilyAddress}>Edit Family Address</Button>
                <br></br>
                <br></br>
                <Button onClick={addChild}>Add a Child</Button>
            </div>
        </>
    )
};