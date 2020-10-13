import React, { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function AddChildPage() {
    const url = window.location.href.split("/");
    const familyId = url[url.length-1];
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  
    
    const [englishFirstName, setEnglishFirstName] = useState('');
    const [englishLastName, setEnglishLastName] = useState('');
    const [chineseName, setChineseName] = useState('');
    const [gender, setGender] = useState('F');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('1');
    const [nativeLanguage, setNativeLanguage] = useState('Mandarin');

    function validateForm() {
        return englishFirstName.length > 0 && englishLastName.length > 0 && gender.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for post request
        var body = {};
        body.englishFirstName = englishFirstName;
        body.englishLastName = englishLastName;
        body.chineseName = chineseName;
        body.birthYear = birthYear === '' ? null : birthYear;
        body.birthMonth = birthMonth === '' ? null : birthMonth;
        body.gender = gender;
        body.nativeLanguage = nativeLanguage;

        const fetch = require("node-fetch");
        const postData = async () => {
            try {
                // first, create a new person
                const postResponse1 = await fetch('/admin/people/add/', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',                                                              
                    body: JSON.stringify( body )                                        
                });

                if( postResponse1.status === 201 ) {
                     // then, add the new person to the family
                    const postResponse2 = await fetch(`/user/family/child/add/${familyId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',                                                              
                        body: JSON.stringify( body )                                        
                    });

                    if( postResponse2.status === 201 ) {
                        if(parseInt(familyId, 10) === userData.family.familyId) {
                            const studentDataResponse = await fetch(`/user/student/data?id=${userData.person.personId}`);
                            var studentData = await studentDataResponse.json();
                            // create a children array for easier display
                            var children = [];
                            studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));
                            setUserData(prevUserData => ({...prevUserData,
                                family: {
                                    familyId: userData.family.familyId,
                                    addressId: userData.family.addressId,
                                    cccaLifetimeMember: userData.family.cccaLifetimeMember,
                                    children: children,
                                    street: userData.family.street,
                                    city: userData.family.city,
                                    state: userData.family.state,
                                    zipcode: userData.family.zipcode,
                                    homePhone: userData.family.homePhone,
                                    cellPhone: userData.family.cellPhone,
                                    email: userData.family.email
                                },
                                students: studentData
                            }))
                        }
                        setStatus('Child Successfully Added.');
                        history.goBack();
                    }
                    else {
                        alert('Failed to add child. Please try again.');
                    }
                }
                else {
                    alert('Failed to add child. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        }
        postData();
    }


    return (
        <>
            <h1>Add Child To Family</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    English First Name: <input type="text" value={englishFirstName} onChange={(e) => setEnglishFirstName(e.target.value)} />
                    <br></br>
                    English Last Name: <input type="text" value={englishLastName} onChange={(e) => setEnglishLastName(e.target.value)} />
                    <br></br>
                    Chinese Name: <input type="text" value={chineseName} onChange={(e) => setChineseName(e.target.value)} />
                    <br></br>
                    Gender: <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}> 
                                <option value="F">F</option>
                                <option value="M">M</option>
                            </select>
                    <br></br>
                    Birth Month: <select id="month" name="month" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                    <br></br>
                    Birth Year: <input type="text" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                    <br></br>
                    Native Language: <select id="language" name="language" value={nativeLanguage} onChange={(e) => setNativeLanguage(e.target.value)} >
                                        <option value="Mandarin">Mandarin</option>
                                        <option value="English">English</option>
                                        <option value="Cantonese">Cantonese</option>
                                        <option value="Other">Other</option>
                                    </select>
                    <br></br>
                </div>
                <br></br>
                <Button type="submit" disabled={!validateForm()}>Save</Button>
            </form>
        </>
    )
};