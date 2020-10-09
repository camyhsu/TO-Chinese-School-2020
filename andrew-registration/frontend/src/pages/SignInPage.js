import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';

export default function SignIn() {
    const { userHasAuthenticated, userData, setUserData } = useAppContext();
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
                    // fetch personal user data to be displayed in Registration Home Page and Registration SideBar
                    const personalDataResponse = await fetch(`/user/data?id=${person_id}`);
                    var personalData = await personalDataResponse.json();
                    // fetch personal user address to be displayed in Registration Home Page and Registration SideBar
                    const personalAddressResponse = await fetch(`/user/address?id=${person_id}`);
                    var personalAddress = await personalAddressResponse.json();
                    // fetch family address data to be displayed in Family Details in Registration Home Page
                    const familyAddressDataResponse = await fetch(`/user/family/address?id=${person_id}`);
                    var familyAddressData = await familyAddressDataResponse.json();
                    // fetch parent two's data to be displayed in Family Details in Registration Home Page
                    const parentDataResponse = await fetch(`/user/parent/data?id=${familyAddressData[0].family_id}`);
                    var parentData = await parentDataResponse.json();
                    // fetch children/student's data to be displayed in Family and Student Details in Registration Home Page
                    const studentDataResponse = await fetch(`/user/student/data?id=${familyAddressData[0].family_id}`);
                    var studentData = await studentDataResponse.json();
                    // create a children array for easier display
                    var children = [];
                    studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));
                    // set the React hook data 
                    setUserData({...userData, 
                        person: {
                            username: username,
                            personId: person_id,
                            addressId: personalAddress[0].address_id,
                            chineseName: personalData[0].chinese_name,
                            englishFirstName: personalData[0].english_first_name,
                            englishLastName: personalData[0].english_last_name,
                            gender: personalData[0].gender,
                            birthMonth: personalData[0].birth_month,
                            birthYear: personalData[0].birth_year,
                            nativeLanguage: personalData[0].native_language,
                            street: personalAddress[0].street,
                            city: personalAddress[0].city,
                            state: personalAddress[0].state,
                            zipcode: personalAddress[0].zipcode,
                            homePhone: personalAddress[0].home_phone,
                            cellPhone: personalAddress[0].cell_phone,
                            email: personalAddress[0].email
                        },
                        parents: {
                            parentOneId: parentData[0].person_id,
                            parentOneEnglishName: parentData[0].english_first_name + ' ' + parentData[0].english_last_name,
                            parentOneChineseName: parentData[0].chinese_name,
                            parentOneUsername: parentData[0].username,
                            parentTwoId: parentData[1].person_id,
                            parentTwoEnglishName: parentData[1].english_first_name + ' ' + parentData[1].english_last_name,
                            parentTwoChineseName: parentData[1].chinese_name,
                            parentTwoUsername: parentData[1].username,
                        },
                        family: {
                            familyId: familyAddressData[0].family_id,
                            addressId: familyAddressData[0].address_id,
                            children: children,
                            street: familyAddressData[0].street,
                            city: familyAddressData[0].city,
                            state: familyAddressData[0].state,
                            zipcode: familyAddressData[0].zipcode,
                            homePhone: familyAddressData[0].home_phone,
                            cellPhone: familyAddressData[0].cell_phone,
                            email: familyAddressData[0].email
                        },
                        students: studentData
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