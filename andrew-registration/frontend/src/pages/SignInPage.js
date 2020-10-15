import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';

export default function SignIn() {
    const { userHasAuthenticated, setUserData, schoolYear, setSchoolYear } = useAppContext();
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fetch = require("node-fetch");
        const fetchData = async () => {
            try {
                // fetch signin data from psql database
                const signInResponse = await fetch(`/admin/signin?username=${username}&&password=${password}`);
                if( signInResponse.status === 200 ) {
                    var person_id = await signInResponse.json();

                    const schoolYearResponse = await fetch(`/admin/schoolYear?id=${schoolYear.id}`);
                    if(schoolYearResponse.status === 200) {
                        var schoolYearData = await schoolYearResponse.json();
                        setSchoolYear(schoolYearData[0]);
                    }
                    else {
                        alert('Failed to get school year data. Please try again.');
                    }

                    const personalDataResponse = await fetch(`/user/data?id=${person_id}`);
                    if(personalDataResponse.status === 200) {
                        var personalData = await personalDataResponse.json();
                    }
                    else {
                        alert('Failed to get personal data. Please try again.');
                    }

                    const personalAddressResponse = await fetch(`/user/address?id=${person_id}`);
                    if(personalAddressResponse.status === 200) {
                        var personalAddressData = await personalAddressResponse.json();
                        if(typeof personalAddressData[0] == 'undefined')
                            personalAddressData = null;
                    }
                    else {
                        alert('Failed to get personal address data. Please try again.');
                    }

                    const familyAddressDataResponse = await fetch(`/user/family/address?id=${person_id}`);
                    if(familyAddressDataResponse.status === 200) {
                        var familyAddressData = await familyAddressDataResponse.json();
                    }
                    else {
                        alert('Failed to get family address data. Please try again.');
                    }

                    const parentDataResponse = await fetch(`/user/parent/data?id=${familyAddressData[0].family_id}`);
                    if(parentDataResponse.status === 200) {
                        var parentData = await parentDataResponse.json();
                    }
                    else {
                        alert('Failed to get parent data. Please try again.');
                    }

                    const studentDataResponse = await fetch(`/user/student/data?id=${familyAddressData[0].family_id}`);
                    if(studentDataResponse.status === 200) {
                        var studentData = await studentDataResponse.json();
                    }
                    else {
                        alert('Failed to get student address data. Please try again.');
                    }

                    var children = [];
                    studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));

                    setUserData({ 
                        personalData: {
                            username: username,
                            personId: person_id,
                            chineseName: personalData[0].chinese_name,
                            englishFirstName: personalData[0].english_first_name,
                            englishLastName: personalData[0].english_last_name,
                            gender: personalData[0].gender,
                            birthMonth: personalData[0].birth_month,
                            birthYear: personalData[0].birth_year,
                            nativeLanguage: personalData[0].native_language,
                        },
                        personalAddress: personalAddressData === null ? null : {
                            addressId: personalAddressData[0].address_id,
                            street: personalAddressData[0].street,
                            city: personalAddressData[0].city,
                            state: personalAddressData[0].state,
                            zipcode: personalAddressData[0].zipcode,
                            homePhone: personalAddressData[0].home_phone,
                            cellPhone: personalAddressData[0].cell_phone,
                            email: personalAddressData[0].email
                        },
                        parentData: {
                            parentOneId: parentData[0].person_id,
                            parentOneEnglishName: parentData[0].english_first_name + ' ' + parentData[0].english_last_name,
                            parentOneChineseName: parentData[0].chinese_name,
                            parentOneUsername: parentData[0].username,
                            parentTwoId: parentData.length === 1 ? null : parentData[1].person_id,
                            parentTwoEnglishName: parentData.length === 1 ? null : parentData[1].english_first_name + ' ' + parentData[1].english_last_name,
                            parentTwoChineseName: parentData.length === 1 ? null : parentData[1].chinese_name,
                            parentTwoUsername: parentData.length === 1 ? null : parentData[1].username,
                        },
                        familyAddress: {
                            familyId: familyAddressData[0].family_id,
                            addressId: familyAddressData[0].address_id,
                            cccaLifetimeMember: familyAddressData[0].ccca_lifetime_member,
                            street: familyAddressData[0].street,
                            city: familyAddressData[0].city,
                            state: familyAddressData[0].state,
                            zipcode: familyAddressData[0].zipcode,
                            homePhone: familyAddressData[0].home_phone,
                            cellPhone: familyAddressData[0].cell_phone,
                            email: familyAddressData[0].email
                        },
                        students: studentData,
                        children : children
                    });
                    userHasAuthenticated(true);
                    // redirect to registration homepage
                    history.push('/registration/home');
                }
                else {
                    alert("Sign In Failed");
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }
    
    return (
        <>
            <h1>Please Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br></br>
                    Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <br></br>
                <Button type="signin" disabled={!validateForm()}>Sign In</Button>
            </form>
        </>
    )
};