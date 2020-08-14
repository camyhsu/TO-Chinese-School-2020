import React, { useState, useEffect } from 'react';
import {Button} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../libs/contextLib';

export default function PeopleProfilePage() {
    const url = window.location.href.split("/");
    const personId = url[url.length-1];
    const history = useHistory();
    const { status } = useAppContext();

    const [personData, setPersonData] = useState({
        'personId':'',
        'username': '',
        'chineseName': '',
        'englishFirstName': '',
        'englishLastName': '',
        'gender': '',
        'birthMonthYear': '',
        'nativeLanguage': '',
    })

    const [personalAddressData, setPersonalAddressData] = useState({
        'addressId':'',
        'street': '',
        'city': '',
        'state': '',
        'zipcode': '',
        'homePhone': '',
        'cellPhone': '',
        'email': '',
    })

    const [parentData, setParentData] = useState({
        'parentOneId': '',
        'parentOneEnglishName': '',
        'parentOneChineseName': '',
        'parentOneUsername': '',
        'parentTwoId':'',
        'parentTwoEnglishName': '',
        'parentTwoChineseName': '',
        'parentTwoUsername': '',
    })

    const [familyData, setFamilyData] = useState({
        'familyId':'',
        'addressId':'',
        'children': [],
        'street': '',
        'city': '',
        'state': '',
        'zipcode': '',
        'homePhone': '',
        'cellPhone': '',
        'email': ''
    });

    function editPersonalDetails() {
        history.push(`/registration/user/edit/${personData.personId}`)
    }

    function editPersonalAddress() {
        history.push(`/registration/user/address/edit/${personData.personId}`)
    }

    function createPersonalAddress() {
        history.push(`/registration/user/address/create/${personData.personId}`)
    }

    function editFamilyAddress() {
        history.push(`/registration/family/address/edit/${parentData.parentOneId}`)
    }

    function addChild() {
        history.push(`/registration/family/addchild/${familyData.familyId}`)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const personInformationResponse = await fetch(`/user/data/${personId}`);
                var personInformation = await personInformationResponse.json();
                setPersonData({
                    personId: personId,
                    username: personInformation[0].username,
                    chineseName: personInformation[0].chinese_name,
                    englishFirstName: personInformation[0].english_first_name,
                    englishLastName: personInformation[0].english_last_name,
                    gender: personInformation[0].gender,
                    birthMonthYear: personInformation[0].birth_month + '/' + personInformation[0].birth_year,
                    nativeLanguage: personInformation[0].native_language,
                });

                const personalAddressInformationResponse = await fetch(`/user/address/${personId}`);
                var personalAddressInformation = await personalAddressInformationResponse.json();
                if(typeof personalAddressInformation[0] == 'undefined') {
                    setPersonalAddressData(null)
                }
                else {
                    setPersonalAddressData({
                        addressId: personalAddressInformation[0].address_id,
                        street: personalAddressInformation[0].street,
                        city: personalAddressInformation[0].city,
                        state: personalAddressInformation[0].state,
                        zipcode: personalAddressInformation[0].zipcode,
                        homePhone: personalAddressInformation[0].home_phone,
                        cellPhone: personalAddressInformation[0].cell_phone,
                        email: personalAddressInformation[0].email
                    });
                }
                
                var familyAddressInformationResponse = await fetch(`/user/family/address/${personId}`);
                var familyAddressInformation = await familyAddressInformationResponse.json();
                if(typeof familyAddressInformation[0] == 'undefined') {
                    // person is a child of a family, so we must retrieve family information from the bottom up
                    familyAddressInformationResponse = await fetch(`/user/family/address/fromchild/${personId}`);
                    familyAddressInformation = await familyAddressInformationResponse.json();
                }

                const parentInformationResponse = await fetch(`/user/parent/data/${familyAddressInformation[0].family_id}`);
                var parentInformation = await parentInformationResponse.json();
                if(parentInformation.length === 1) {
                    setParentData({
                        parentOneId: parentInformation[0].person_id,
                        parentOneEnglishName: `${parentInformation[0].english_first_name} ${parentInformation[0].english_last_name}`,
                        parentOneChineseName: parentInformation[0].chinese_name,
                        parentOneUsername: parentInformation[0].username == null ? '' : parentInformation[0].username,
                    })
                }
                else {
                    setParentData({
                        parentOneId: parentInformation[0].person_id,
                        parentOneEnglishName: `${parentInformation[0].english_first_name} ${parentInformation[0].english_last_name}`,
                        parentOneChineseName: parentInformation[0].chinese_name,
                        parentOneUsername: parentInformation[0].username == null ? '' : parentInformation[0].username,
                        parentTwoId: parentInformation[1].person_id,
                        parentTwoEnglishName: `${parentInformation[1].english_first_name} ${parentInformation[1].english_last_name}`,
                        parentTwoChineseName: parentInformation[1].chinese_name,
                        parentTwoUsername: parentInformation[1].username,
                    });
                }

                const studentDataResponse = await fetch(`/user/student/data/${parentInformation[0].person_id}`);
                var studentData = await studentDataResponse.json();
                var children = [];
                studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));

                setFamilyData({
                    familyId: familyAddressInformation[0].family_id,
                    addressId: familyAddressInformation[0].address_id,
                    children: children,
                    street: familyAddressInformation[0].street,
                    city: familyAddressInformation[0].city,
                    state: familyAddressInformation[0].state,
                    zipcode: familyAddressInformation[0].zipcode,
                    homePhone: familyAddressInformation[0].home_phone,
                    cellPhone: familyAddressInformation[0].cell_phone,
                    email: familyAddressInformation[0].email
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    },[personId])

    return (
        <>
            <p id="status">{status}</p>
            <h4>Person</h4>
            <p><b>Chinese Name:</b> {personData.chineseName}</p>
            <p><b>English Name:</b> {personData.englishFirstName} {personData.englishLastName}</p>
            <p><b>Gender:</b> {personData.gender}</p>
            <p><b>Birth Month/Year:</b> {personData.birthMonthYear === 'null/null' ? null : personData.birthMonthYear}</p>
            <p><b>Native Language:</b> {personData.nativeLanguage}</p>
            <Button onClick={editPersonalDetails}>Edit Person Details</Button>
            {personalAddressData == null ? <Button onClick={createPersonalAddress}>Create Personal Address</Button> : 
                <>
                    <p><b>Address:</b> {personalAddressData.street}, {personalAddressData.city}, {personalAddressData.state} {personalAddressData.zipcode}</p>
                    <p><b>Home Phone:</b> ({personalAddressData.homePhone.slice(0,3)}) {personalAddressData.homePhone.slice(3,6)}-{personalAddressData.homePhone.slice(6)}</p>
                    {personalAddressData.cellPhone === '' ? <p><b>Cell Phone: </b></p> :  
                        <p><b>Cell Phone: </b>({personalAddressData.cellPhone.slice(0,3)}) {personalAddressData.cellPhone.slice(3,6)}-{personalAddressData.cellPhone.slice(6)}</p>}
                    <p><b>Email:</b> {personalAddressData.email}</p>
                    <Button onClick={editPersonalAddress}>Edit Personal Address</Button>
                </>}
            <hr></hr>

            <h4>Family for {personData.chineseName} ({personData.englishFirstName} {personData.englishLastName})</h4>
            <p><b>Parent One:</b> {parentData.parentOneChineseName} ({parentData.parentOneEnglishName}) <b>Username:</b> {parentData.parentOneUsername}</p>
            {parentData.parentTwoChineseName == null && parentData.parentTwoEnglishName == null && parentData.parentTwoUsername == null ? <p><b>Parent Two: </b></p> : 
                <p><b>Parent Two:</b> {parentData.parentTwoChineseName} ({parentData.parentTwoEnglishName}) <b>Username:</b> {parentData.parentTwoUsername}</p>}
            <p><b>Children:</b> {familyData.children.join(", ")}</p>
            <p><b>Address:</b> {familyData.street}, {familyData.city}, {familyData.state} {familyData.zipcode}</p>
            <p><b>Home Phone:</b> ({familyData.homePhone.slice(0,3)}) {familyData.homePhone.slice(3,6)}-{familyData.homePhone.slice(6)}</p>
            {familyData.cellPhone === '' ? <p><b>Cell Phone: </b></p> :  
                <p><b>Cell Phone: </b>({familyData.cellPhone.slice(0,3)}) {familyData.cellPhone.slice(3,6)}-{familyData.cellPhone.slice(6)}</p>}
            <p><b>Email:</b> {familyData.email}</p>
            <Button onClick={editFamilyAddress}>Edit Family Address</Button>
            <Button onClick={addChild}>Add Child</Button>
            <hr></hr>

            <h4>Grade and Class Assignments for </h4>
            <hr></hr>
            
            <h4>Transaction History as Student for </h4>
            <hr></hr>

            <h4>Instruction Assignments for </h4>
            <hr></hr>
        </>
    )
};