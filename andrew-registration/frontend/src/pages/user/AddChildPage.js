import React, { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function AddChildPage() {
    const url = window.location.href.split("/");
    const familyId = url[url.length-1];
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  

    const [changes, setChanges] = useState({
        english_first_name: '',
        english_last_name: '',
        chinese_name: '',
        gender: 'F',
        birth_month: '1',
        birth_year: '',
        native_language: 'Mandarin',
    });

    const handleInputChange = (e) => {
        setChanges({
            ...changes,
            [e.target.name]: e.target.value
        });
    };

    function validateForm() {
        return changes.english_first_name.length > 0 && changes.english_last_name.length > 0 && changes.gender.length > 0 && changes.birth_year.length === 4;
    }

    function handleSubmit(event) {
        event.preventDefault();

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
                    body: JSON.stringify( changes )                                        
                });

                if( postResponse1.status === 201 ) {
                     // then, add the new person to the family
                    const postResponse2 = await fetch(`/user/family/child/add/${familyId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',                                                              
                        body: JSON.stringify( changes )                                        
                    });

                    if( postResponse2.status === 201 ) {
                        if(parseInt(familyId, 10) === userData.familyAddress.familyId) {
                            const studentDataResponse = await fetch(`/user/student/data?id=${familyId}`);
                            var studentData = await studentDataResponse.json();
                            // create a children array for easier display
                            var children = [];
                            studentData.forEach(student => children.push(`${student.chinese_name} (${student.english_first_name} ${student.english_last_name})`));
                            setUserData(prevUserData => ({...prevUserData,
                                students: studentData,
                                children: children
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
                    English First Name: <input type="text" name="english_first_name" value={changes.english_first_name} onChange={handleInputChange} />
                    <br></br>
                    English Last Name: <input type="text" name="english_last_name" value={changes.english_last_name} onChange={handleInputChange} />
                    <br></br>
                    Chinese Name: <input type="text" name="chinese_name" value={changes.chinese_name} onChange={handleInputChange} />
                    <br></br>
                    Gender: <select id="gender" name="gender" value={changes.gender} onChange={handleInputChange}> 
                                <option value="F">F</option>
                                <option value="M">M</option>
                            </select>
                    <br></br>
                    Birth Month: <select id="month" name="birth_month" value={changes.birth_month} onChange={handleInputChange}>
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
                    Birth Year: <input type="text" name="birth_year" size="5" value={changes.birth_year} onChange={handleInputChange} />
                    <br></br>
                    Native Language: <select id="language" name="native_language" value={changes.native_language} onChange={handleInputChange} >
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