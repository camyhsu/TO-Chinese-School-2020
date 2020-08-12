import React, { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function EditStudentDetailsPage() {
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();
    // get the index of the student in the student array
    const url = window.location.href.split("/");
    const studentIndex = url[url.length-1];
    
    const [englishFirstName, setEnglishFirstName] = useState(userData.students[studentIndex].english_first_name);
    const [englishLastName, setEnglishLastName] = useState(userData.students[studentIndex].english_last_name);
    const [chineseName, setChineseName] = useState(userData.students[studentIndex].chinese_name);
    const [gender, setGender] = useState(userData.students[studentIndex].gender);
    const [birthYear, setBirthYear] = useState(userData.students[studentIndex].birth_year);
    const [birthMonth, setBirthMonth] = useState(userData.students[studentIndex].birth_month);
    const [nativeLanguage, setNativeLanguage] = useState(userData.students[studentIndex].native_language);

    function validateForm() {
        return englishFirstName.length > 0 && englishLastName.length > 0 && gender.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for patch request
        var body = {};
        body.englishFirstName = englishFirstName !== userData.students[studentIndex].english_first_name ? englishFirstName : userData.students[studentIndex].english_first_name;
        body.englishLastName = englishLastName !== userData.students[studentIndex].english_last_name ? englishLastName : userData.students[studentIndex].english_last_name;
        body.chineseName = chineseName !== userData.students[studentIndex].chinese_name ? chineseName : userData.students[studentIndex].chinese_name;
        body.birthYear = birthYear !== userData.students[studentIndex].birth_year ? birthYear : userData.students[studentIndex].birth_year;
        body.birthYear = birthYear === '' ? null : birthYear;
        body.birthMonth = birthMonth !== userData.students[studentIndex].birth_month ? birthMonth : userData.students[studentIndex].birth_month;
        body.birthMonth = birthMonth === '' ? null : birthMonth;
        body.gender = gender !== userData.students[studentIndex].gender ? gender : userData.students[studentIndex].gender;
        body.nativeLanguage = nativeLanguage !== userData.students[studentIndex].native_language ? nativeLanguage : userData.students[studentIndex].native_language;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                await fetch(`/user/userdata/edit/details/${userData.students[studentIndex].id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                // re-fetch data to update in display
                const studentDataResponse = await fetch(`/user/studentdata/${userData.person.person_id}`);
                var studentData = await studentDataResponse.json();
                // create a children array for easier display
                var children = [];
                studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));
                setUserData(prevUserData => ({...prevUserData,
                    family: {
                        family_id: userData.family.family_id,
                        address_id: userData.family.address_id,
                        parentTwoEnglishName: userData.family.parentTwoEnglishName,
                        parentTwoChineseName: userData.family.parentTwoChineseName,
                        children: children,
                        street: userData.family.street,
                        city: userData.family.city,
                        state: userData.family.state,
                        zipcode: userData.family.zipcode,
                        homePhone: userData.family.home_phone,
                        cellPhone: userData.family.cell_phone,
                        email: userData.family.email
                    },
                    students: studentData
                }))
                setStatus('Student Details Successfully Updated.');
                history.push('/registration');
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }

    return (
        <>
            <h1>Edit Students Details for {userData.students[studentIndex].chinese_name} ({userData.students[studentIndex].english_first_name} {userData.students[studentIndex].english_last_name})</h1>
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