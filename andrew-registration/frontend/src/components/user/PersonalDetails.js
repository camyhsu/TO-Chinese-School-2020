import React from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function PersonDetails() {
    const { userData } = useAppContext();
    const history = useHistory();

    function editPersonalDetails() {
        history.push(`/registration/user/edit/${userData.personalData.personId}`);
    }

    function editPersonalAddress() {
        history.push(`/registration/user/address/edit/${userData.personalData.personId}`);
    }

    function createPersonalAddress() {
        history.push(`/registration/user/address/create/${userData.personalData.personId}`);
    }

    return (
        <>
            <div className = "details">
                <h3>Person</h3>
                <p>Chinese Name: {userData.personalData.chineseName == null ? '' : userData.personalData.chineseName}</p>
                <p>English Name: {userData.personalData.englishFirstName} {userData.personalData.englishLastName}</p>
                <p>Gender: {userData.personalData.gender == null ? '' : userData.personalData.gender}</p>
                <p>Birth Date (MM/YYYY): {userData.personalData.birthMonth}/{userData.personalData.birthYear}</p>
                <p>Native Language: {userData.personalData.nativeLanguage == null ? '' : userData.personalData.nativeLanguage}</p>
                <Button onClick={editPersonalDetails}>Edit Personal Details</Button>
                {userData.personalAddress == null ? <div><Button onClick={createPersonalAddress}>Create Personal Address</Button></div> : 
                <div>
                    <p>Address: {userData.personalAddress.street}, {userData.personalAddress.city}, {userData.personalAddress.state} {userData.personalAddress.zipcode}</p>
                    <p>Home Phone: ({userData.personalAddress.homePhone.slice(0,3)}) {userData.personalAddress.homePhone.slice(3,6)}-{userData.personalAddress.homePhone.slice(6)}</p>
                    <p>Cell Phone: {userData.personalAddress.cellPhone == null || userData.personalAddress.cellPhone.length === 0 ? '' : '(' + userData.personalAddress.cellPhone.slice(0,3) + ') ' + userData.personalAddress.cellPhone.slice(3,6) + '-' + userData.personalAddress.cellPhone.slice(6)}</p>
                    <p>Email: {userData.personalAddress.email == null ? '' : userData.personalAddress.email}</p>
                    <Button onClick={editPersonalAddress}>Edit Personal Address</Button>
                </div>}
            </div>
        </>
    )
};