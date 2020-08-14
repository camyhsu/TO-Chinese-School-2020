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
        'chinese_name':'',
        'english_first_name':'',
        'english_last_name':'',
        'gender':'',
        'birth_year':'',
        'birth_month':'',
        'native_language':''
    });

    const [englishFirstName, setEnglishFirstName] = useState('');
    const [englishLastName, setEnglishLastName] = useState('');
    const [chineseName, setChineseName] = useState('');
    const [gender, setGender] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/user/data/${personId}`);
                var json = await response.json();
                setPersonDetails(json[0]);
                setEnglishFirstName(json[0].english_first_name);
                setEnglishLastName(json[0].english_last_name);
                setChineseName(json[0].chinese_name);
                setGender(json[0].gender);
                setBirthYear(json[0].birth_year);
                setBirthMonth(json[0].birth_month);
                setNativeLanguage(json[0].native_language);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [personId])

    function validateForm() {
        return englishFirstName.length > 0 && englishLastName.length > 0 && gender.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for patch request
        var body = {};
        body.englishFirstName = englishFirstName;
        body.englishLastName = englishLastName;
        body.chineseName = chineseName;
        body.birthYear = birthYear === '' ? null : birthYear;
        body.birthMonth = birthMonth === '' ? null : birthMonth;
        body.gender = gender;
        body.nativeLanguage = nativeLanguage;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                await fetch(`/user/data/edit/${personId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                if(parseInt(personId,10) === userData.person.personId) {
                    const personalDataResponse = await fetch(`/user/data/${userData.person.personId}`);
                    var personalData = await personalDataResponse.json();
                    const personalAddressResponse = await fetch(`/user/address/${userData.person.personId}`);
                    var personalAddress = await personalAddressResponse.json();
                    setUserData(prevUserData => ({...prevUserData,
                        person: {
                            username: userData.person.username,
                            personId: userData.person.personId,
                            addressId: personalData[0].address_id,
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
                    }))
                }
                setStatus('Personal Details Successfully Updated.');
                history.goBack();
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