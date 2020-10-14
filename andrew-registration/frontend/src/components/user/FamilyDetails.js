import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function FamilyDetails() {
    const { userData } = useAppContext();

    const history = useHistory();

    function editFamilyAddress() {
        history.push(`/registration/family/address/edit/${userData.personalData.personId}`);
    }

    function addChild() {
        history.push(`/registration/family/child/add/${userData.familyAddress.familyId}`);
    }


    return (
        <>
            <div className = "details">
                <h3>Family for {userData.personalData.chineseName} ({userData.personalData.englishFirstName} {userData.personalData.englishLastName})</h3>
                <p>Parent One: {userData.parentData.parentOneChineseName} ({userData.parentData.parentOneEnglishName})</p>
                {userData.parentData.parentTwoId === null ? null : <p>Parent Two: {userData.parentData.parentTwoChineseName} ({userData.parentData.parentTwoEnglishName})</p>}
                <p>Children: {userData.children.join(", ")}</p>
                <p>Address: {userData.familyAddress.street}, {userData.familyAddress.city}, {userData.familyAddress.state} {userData.familyAddress.zipcode}</p>
                <p>Home Phone: ({userData.familyAddress.homePhone.slice(0,3)}) {userData.familyAddress.homePhone.slice(3,6)}-{userData.familyAddress.homePhone.slice(6)}</p>
                <p>Cell Phone: {userData.familyAddress.cellPhone == null || userData.personalAddress.cellPhone.length < 10 ? '' : '(' + userData.familyAddress.cellPhone.slice(0,3) + ') ' + userData.familyAddress.cellPhone.slice(3,6) + '-' + userData.familyAddress.cellPhone.slice(6)}</p>  
                <p>Email: {userData.familyAddress.email == null ? '' : userData.familyAddress.email}</p>
                <Button onClick={editFamilyAddress}>Edit Family Address</Button>
                <br></br>
                <br></br>
                <Button onClick={addChild}>Add a Child</Button>
            </div>
        </>
    )
};