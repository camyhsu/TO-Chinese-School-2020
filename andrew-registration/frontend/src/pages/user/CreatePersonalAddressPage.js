import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function CreatePersonalAddressPage() {
    const url = window.location.href.split("/");
    const personId = url[url.length-1];
    const { setStatus } = useAppContext(); 
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
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('CA');
    const [zipcode, setZipcode] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');

    function containsOnlyDigits(val) {
        return /^\d+$/.test(val)
    }

    function validateForm() {
        if( cellPhone.length > 0 )
            return street.length > 0 && city.length > 0 && (containsOnlyDigits(zipcode) && zipcode.length === 5) && (containsOnlyDigits(homePhone) && homePhone.length > 0) && email.length > 0 && containsOnlyDigits(cellPhone);
        return street.length > 0 && city.length > 0 && (containsOnlyDigits(zipcode) && zipcode.length === 5) && (containsOnlyDigits(homePhone) && homePhone.length > 0) && email.length > 0;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/user/data?id=${personId}`);
                var json = await response.json();
                setPersonDetails(json[0]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [personId])

    function handleSubmit(event) {
        event.preventDefault();

        // create body for post request
        var body = {};
        body.street = street;
        body.city = city;
        body.state = state;
        body.zipcode = zipcode;
        body.homePhone = homePhone;
        body.cellPhone = cellPhone;
        body.email = email;

        const fetch = require("node-fetch");
        const postData = async () => {
            try {
                // first, create a new address
                await fetch('/admin/address/add/', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',                                                              
                    body: JSON.stringify( body )                                        
                });
                // then, add the new address id to the person
                await fetch(`/user/address/add/${personId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',                                                              
                    body: JSON.stringify( body )                                        
                });

                setStatus('Address Successfully Created.');
                history.goBack();
            } catch (error) {
                console.log(error);
            }
        }
        postData();
    }

    return (
        <>
            <h1>Create Address Details for {personDetails.chinese_name} ({personDetails.english_first_name} {personDetails.english_last_name})</h1>
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