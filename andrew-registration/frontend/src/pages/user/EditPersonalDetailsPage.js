import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';


export default function EditPersonalDetailsPage() {
    const url = window.location.href.split("/");
    const personId = url[url.length-1];

    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  

    const [personDetails, setPersonDetails] = useState({
        english_first_name: '',
        english_last_name: '',
        chinese_name: '',
        birth_year: '',
        birth_month: '',
        native_language: '',
        gender: ''
    });
    const [changes, setChanges] = useState({
        english_first_name: '',
        english_last_name: '',
        chinese_name: '',
        birth_year: '',
        birth_month: '',
        native_language: '',
        gender: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/user/data?id=${personId}`);
                if(response.status === 200) {
                    var json = await response.json();
                    setPersonDetails(json[0]);
                    setChanges(json[0]);
                }
                else {
                    alert('Failed to get personal data. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [personId]);

    const handleInputChange = (e) => {
        setChanges({
            ...changes,
            [e.target.name]: e.target.value
        });
    };

    function validateForm() {
        return changes.english_first_name.length > 0 && changes.english_last_name.length > 0 && changes.gender.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log(changes);

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                const patchResponse = await fetch(`/user/data/edit/${personId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( changes )                                        
                });

                if(patchResponse.status === 200) {
                    if(parseInt(personId,10) === userData.personalData.personId) {
                        const personalDataResponse = await fetch(`/user/data?id=${userData.personalData.personId}`);
                        var personalData = await personalDataResponse.json();
                        setUserData(prevUserData => ({...prevUserData,
                            personalData: {
                                username: userData.personalData.username,
                                personId: userData.personalData.personId,
                                chineseName: personalData[0].chinese_name,
                                englishFirstName: personalData[0].english_first_name,
                                englishLastName: personalData[0].english_last_name,
                                gender: personalData[0].gender,
                                birthMonth: personalData[0].birth_month,
                                birthYear: personalData[0].birth_year,
                                nativeLanguage: personalData[0].native_language,
                            },
                        }))
                    }
                    setStatus('Personal Details Successfully Updated.');
                    history.goBack();
                }
                else {
                    alert('Failed to update personal details. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }


    return (
        <>
            <h1>Edit Personal Details for {personDetails.chinese_name} ({personDetails.english_first_name} {personDetails.english_last_name})</h1>
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
                                    <option value=""></option>
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
                    Birth Year: <input type="text" name="birth_year" maxLength='4' size='5' value={changes.birth_year} onChange={handleInputChange} />
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