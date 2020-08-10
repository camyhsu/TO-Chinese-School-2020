import React, { useState } from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function EditPersonalAddressPage() {
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  
    
    const [street, setStreet] = useState(userData.person.street);
    const [city, setCity] = useState(userData.person.city);
    const [state, setState] = useState(userData.person.state);
    const [zipcode, setZipcode] = useState(userData.person.zipcode);
    const [homePhone, setHomePhone] = useState(userData.person.homePhone);
    const [cellPhone, setCellPhone] = useState(userData.person.cellPhone);
    const [email, setEmail] = useState(userData.person.email);

    function containsOnlyDigits(val) {
        return /^\d+$/.test(val)
    }

    function validateForm() {
        if( cellPhone.length > 0 )
            return street.length > 0 && city.length > 0 && (containsOnlyDigits(zipcode) && zipcode.length === 5) && (containsOnlyDigits(homePhone) && homePhone.length > 0) && email.length > 0 && containsOnlyDigits(cellPhone);
        return street.length > 0 && city.length > 0 && (containsOnlyDigits(zipcode) && zipcode.length === 5) && (containsOnlyDigits(homePhone) && homePhone.length > 0) && email.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for patch request
        var body = {};
        body.street = street !== userData.person.street ? street : userData.person.street;
        body.city = city !== userData.person.city ? city : userData.person.city;
        body.state = state !== userData.person.state ? state : userData.person.state;
        body.zipcode = zipcode !== userData.person.zipcode ? zipcode : userData.person.zipcode;
        body.homePhone = homePhone !== userData.person.homePhone ? homePhone : userData.person.homePhone;
        body.cellPhone = cellPhone !== userData.person.cellPhone ? cellPhone : userData.person.cellPhone;
        body.email = email !== userData.person.email ? email : userData.person.email;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                await fetch(`/person/userdata/edit/address/${userData.person.address_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                // re-fetch data to update in display
                const userPersonalDataResponse = await fetch(`/person/userdata/${userData.person.person_id}`);
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
                setStatus('Personal Address Successfully Updated.');
                history.push('/registration');
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }


    return (
        <>
            <h1>Edit Address Details for {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    Street: <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <br></br>
                    City: <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    <br></br>
                    State: <select id="state" name="state" value={state} onChange={(e) => setState(e.target.value)}>
                                    <option value="CA">CA</option>
                            </select>
                    <br></br>
                    Zipcode: <input type="text" value={zipcode} size="5" onChange={(e) => setZipcode(e.target.value)} />
                    <br></br>
                    Home Phone: <input type="text" value={homePhone} onChange={(e) => setHomePhone(e.target.value)} />
                    <br></br>
                    Cell Phone: <input type="text" value={cellPhone} onChange={(e) => setCellPhone(e.target.value)} />
                    <br></br>
                    Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <br></br>
                </div>
                <br></br>
                <Button type="submit" disabled={!validateForm()}>Save</Button>
            </form>
        </>
    )
};