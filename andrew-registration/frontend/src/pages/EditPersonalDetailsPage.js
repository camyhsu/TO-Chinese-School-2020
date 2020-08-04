import React, { useState } from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function EditPersonalDetailsPage() {
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  
    
    const [englishFirstName, setEnglishFirstName] = useState(userData.person.englishFirstName);
    const [englishLastName, setEnglishLastName] = useState(userData.person.englishLastName);
    const [chineseName, setChineseName] = useState(userData.person.chineseName);
    const [gender, setGender] = useState(userData.person.gender);
    const [birthYear, setBirthYear] = useState(userData.person.birthYear);
    const [birthMonth, setBirthMonth] = useState(userData.person.birthMonth);
    const [nativeLanguage, setNativeLanguage] = useState(userData.person.nativeLanguage);

    function validateForm() {
        return englishFirstName.length > 0 && englishLastName.length > 0 && gender.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for patch request
        var body = {};
        body.englishFirstName = englishFirstName !== userData.person.englishFirstName ? englishFirstName : userData.person.englishFirstName;
        body.englishLastName = englishLastName !== userData.person.englishLastName ? englishLastName : userData.person.englishLastName;
        body.chineseName = chineseName !== userData.person.chineseName ? chineseName : userData.person.chineseName;
        body.birthYear = birthYear !== userData.person.birthYear ? birthYear : userData.person.birthYear;
        body.birthYear = birthYear === '' ? null : birthYear;
        body.birthMonth = birthMonth !== userData.person.birthMonth ? birthMonth : userData.person.birthMonth;
        body.birthMonth = birthMonth === '' ? null : birthMonth;
        body.gender = gender !== userData.person.gender ? gender : userData.person.gender;
        body.nativeLanguage = nativeLanguage !== userData.person.nativeLanguage ? nativeLanguage : userData.person.nativeLanguage;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                await fetch(`/userdata/edit/details/${userData.person.person_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                // re-fetch data to update in display
                const userPersonalDataResponse = await fetch(`/userdata/${userData.person.person_id}`);
                var userPersonalData = await userPersonalDataResponse.json();
                setUserData(prevUserData => ({...prevUserData,
                    person: {
                        username: userData.person.username,
                        person_id: userData.person.person_id,
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
                }))
                setStatus('Personal Details Successfully Updated.');
                history.push('/registration');
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }


    return (
        <>
            <h1>Edit Personal Details</h1>
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