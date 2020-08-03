import React from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function PersonDetails() {
    const { userData } = useAppContext();
    const history = useHistory();

    function editPersonalDetails() {
        history.push('/registration/user/edit');
    }

    function editPersonalAddress() {
        history.push('/registration/user/address/edit');
    }

    return (
        <>
            <div className = "details">
                <h3>Person</h3>
                <p>Chinese Name: {userData.person.chineseName == null ? '' : userData.person.chineseName}</p>
                <p>English Name: {userData.person.englishFirstName} {userData.person.englishLastName}</p>
                <p>Gender: {userData.person.gender == null ? '' : userData.person.gender}</p>
                <p>Birth Date (MM/YYYY): {userData.person.birthMonth}/{userData.person.birthYear}</p>
                <p>Native Language: {userData.person.nativeLanguage == null ? '' : userData.person.nativeLanguage}</p>
                <Button onClick={editPersonalDetails}>Edit Personal Details</Button>
                <p>Address: {userData.person.street}, {userData.person.city}, {userData.person.state} {userData.person.zipcode}</p>
                <p>Home Phone: {userData.person.homePhone == null ? '' : userData.person.homePhone}</p>
                <p>Cell Phone: {userData.person.cellPhone == null ? '' : userData.person.cellPhone}</p>
                <p>Email: {userData.person.email == null ? '' : userData.person.email}</p>
                <Button onClick={editPersonalAddress}>Edit Personal Address</Button>
            </div>
        </>
    )
};