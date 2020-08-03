import React, { useState } from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function EditFamilyAddressPage() {
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  
    
    const [street, setStreet] = useState(userData.family.street);
    const [city, setCity] = useState(userData.family.city);
    const [state, setState] = useState(userData.family.state);
    const [zipcode, setZipcode] = useState(userData.family.zipcode);
    const [homePhone, setHomePhone] = useState(userData.family.homePhone);
    const [cellPhone, setCellPhone] = useState(userData.family.cellPhone);
    const [email, setEmail] = useState(userData.family.email);

    function validateForm() {
        return street.length > 0 && city.length > 0 && zipcode.length === 5 && homePhone.length > 0 && email.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        // create body for patch request
        var body = {};
        body.street = street !== userData.family.street ? street : userData.family.street;
        body.city = city !== userData.family.city ? city : userData.family.city;
        body.state = state !== userData.family.state ? state : userData.family.state;
        body.zipcode = zipcode !== userData.family.zipcode ? zipcode : userData.family.zipcode;
        body.homePhone = homePhone !== userData.family.homePhone ? homePhone : userData.family.homePhone;
        body.cellPhone = cellPhone !== userData.family.cellPhone ? cellPhone : userData.family.cellPhone;
        body.email = email !== userData.family.email ? email : userData.family.email;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                await fetch(`/userdata/edit/address/${userData.family.address_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                // re-fetch data to update in display
                const familyAddressDataResponse = await fetch(`/userdata/${userData.person.person_id}`);
                var familyAddressData = await familyAddressDataResponse.json();
                setUserData(prevUserData => ({...prevUserData,
                    family: {
                        family_id: userData.family.family_id,
                        address_id: familyAddressData[0].id,
                        parentTwoEnglishName: userData.family.parentTwoEnglishName,
                        parentTwoChineseName: userData.family.parentTwoChineseName,
                        children: userData.family.children,
                        street: familyAddressData[0].street,
                        city: familyAddressData[0].city,
                        state: familyAddressData[0].state,
                        zipcode: familyAddressData[0].zipcode,
                        homePhone: familyAddressData[0].home_phone,
                        cellPhone: familyAddressData[0].cell_phone,
                        email: familyAddressData[0].email
                    },
                }))
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
        setStatus('Family Address Successfully Updated.');
        history.push('/registration');
    }


    return (
        <>
            <h1>Edit Family Address Details</h1>
            <h3>Parent One: {userData.person.chineseName} ({userData.person.englishFirstName} {userData.person.englishLastName})</h3>
            <h3>Parent Two: {userData.family.parentTwoChineseName} ({userData.family.parentTwoEnglishName})</h3>
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