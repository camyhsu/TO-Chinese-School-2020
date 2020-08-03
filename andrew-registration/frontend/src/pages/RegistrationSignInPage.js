import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { sha256 } from 'js-sha256';

export default function SignIn() {
    const { isAuthenticated, userHasAuthenticated, userData, setUserData } = useAppContext();
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
                const signInResponse = await fetch(`/signin/username/${username}/password/${password}`);
                var hash = await signInResponse.json();
                const pass_salt = password + hash[0].password_salt;
                // ensure password is valid
                if(sha256(pass_salt) === hash[0].password_hash) {
                    // fetch personal user data to be displayed in Registration Home Page and Registration SideBar
                    const userPersonalDataResponse = await fetch(`/userdata/${hash[0].person_id}`);
                    var userPersonalData = await userPersonalDataResponse.json();
                    // fetch parent two's data to be displayed in Family Details in Registration Home Page
                    const parentTwoDataResponse = await fetch(`/parentdata/${hash[0].person_id}`);
                    var parentTwoData = await parentTwoDataResponse.json();
                    // fetch family address data to be displayed in Family Details in Registration Home Page
                    const familyAddressDataResponse = await fetch(`/familyaddressdata/${hash[0].person_id}`);
                    var familyAddressData = await familyAddressDataResponse.json();
                    // fetch children/student's data to be displayed in Family and Student Details in Registration Home Page
                    const studentDataResponse = await fetch(`/studentdata/${hash[0].person_id}`);
                    var studentData = await studentDataResponse.json();
                    // create a children array for easier display
                    var children = [];
                    studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));
                    // set the React hook data 
                    setUserData({...userData, 
                        person: {
                            person_id: hash[0].person_id,
                            address_id: userPersonalData[0].address_id,
                            chineseName: userPersonalData[0].chinese_name,
                            englishFirstName: userPersonalData[0].english_first_name,
                            englishLastName: userPersonalData[0].english_last_name,
                            gender: userPersonalData[0].gender,
                            birthMonth: userPersonalData[0].birth_month,
                            birthYear: userPersonalData[0].birth_year,
                            nativeLanguage: userPersonalData[0].native_language,
                            street: userPersonalData[0].street,
                            city: userPersonalData[0].city,
                            state: userPersonalData[0].state,
                            zipcode: userPersonalData[0].zipcode,
                            homePhone: userPersonalData[0].home_phone,
                            cellPhone: userPersonalData[0].cell_phone,
                            email: userPersonalData[0].email
                        },
                        family: {
                            family_id: parentTwoData[0].family_id,
                            address_id: familyAddressData[0].id,
                            parentTwoEnglishName: `${parentTwoData[0].english_first_name} ${parentTwoData[0].english_last_name}`,
                            parentTwoChineseName: parentTwoData[0].chinese_name,
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
                    history.push('/registration');
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
                    Password: <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <br></br>
                <Button type="signin" disabled={!validateForm()}>Sign In</Button>
            </form>
        </>
    )
};