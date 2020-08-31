import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function EditPersonalAddressPage() {
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
    const [addressDetails, setAddressDetails] = useState();
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('CA');
    const [zipcode, setZipcode] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const personResponse = await fetch(`/user/data?id=${personId}`);
                var person = await personResponse.json();
                setPersonDetails(person[0]);
                const addressResponse = await fetch(`/user/address?id=${personId}`);
                var address = await addressResponse.json();
                setAddressDetails(address[0]);
                
                setStreet(address[0].street);
                setCity(address[0].city);
                setState(address[0].state);
                setZipcode(address[0].zipcode);
                setHomePhone(address[0].home_phone);
                setCellPhone(address[0].cell_phone);
                setEmail(address[0].email);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [personId])


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
        body.street = street;
        body.city = city;
        body.state = state;
        body.zipcode = zipcode;
        body.homePhone = homePhone;
        body.cellPhone = cellPhone;
        body.email = email;

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                const patchResponse = await fetch(`/user/address/edit/${addressDetails.address_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });
            
                if( patchResponse.status === 200 ) {
                    if(parseInt(personId,10) === userData.person.personId) {
                        const personalDataResponse = await fetch(`/user/data?id=${userData.person.personId}`);
                        var personalData = await personalDataResponse.json();
                        const personalAddressResponse = await fetch(`/user/address?id=${userData.person.personId}`);
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
                    setStatus('Personal Address Successfully Updated.');
                    history.goBack();
                }
                else {
                    alert('Failed to update personal address. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }


    return (
        <>
            <h1>Edit Address Details for {personDetails.chinese_name} ({personDetails.english_first_name} {personDetails.english_last_name})</h1>
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