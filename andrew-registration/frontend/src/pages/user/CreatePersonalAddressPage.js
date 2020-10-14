import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function CreatePersonalAddressPage() {
    const url = window.location.href.split("/");
    const personId = url[url.length-1];
    const { setStatus, userData, setUserData } = useAppContext(); 
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
    const [changes, setChanges] = useState({
        street: '',
        city: '',
        state: '',
        zipcode: '',
        home_phone: '',
        cell_phone: '',
        email: '',
    });

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
    }, [personId]);

    const handleInputChange = (e) => {
        setChanges({
            ...changes,
            [e.target.name]: e.target.value
        });
    };

    function containsOnlyDigits(val) {
        return /^\d+$/.test(val)
    }

    function validateForm() {
        if( changes.cell_phone.length > 0 )
            return changes.street.length > 0 && changes.city.length > 0 && (containsOnlyDigits(changes.zipcode) && changes.zipcode.length === 5) && (containsOnlyDigits(changes.home_phone) && changes.home_phone.length > 0) && changes.email.length > 0 && (containsOnlyDigits(changes.cell_phone) && changes.cell_phone.length === 10);
        return changes.street.length > 0 && changes.city.length > 0 && (containsOnlyDigits(changes.zipcode) && changes.zipcode.length === 5) && (containsOnlyDigits(changes.home_phone) && changes.home_phone.length ===  10) && changes.email.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fetch = require("node-fetch");
        const postData = async () => {
            try {
                // first, create a new address
                const postResponse1 = await fetch('/admin/address/add/', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',                                                              
                    body: JSON.stringify( changes )                                        
                });

                if( postResponse1.status === 201 ) {
                    // then, add the new address id to the person
                    const postResponse2 = await fetch(`/user/address/add/${personId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',                                                              
                        body: JSON.stringify( changes )                                        
                    });

                    if( postResponse2.status === 201 ) {
                        if(parseInt(personId,10) === userData.personalData.personId) {
                            const personalAddressResponse = await fetch(`/user/address?id=${userData.personalData.personId}`);
                            var personalAddress = await personalAddressResponse.json();
                            setUserData(prevUserData => ({...prevUserData,
                                personalAddress: {
                                    addressId: personalAddress[0].address_id,
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
                        setStatus('Address Successfully Created.');
                        history.goBack();
                    }
                    else {
                        alert('Failed to add address to person. Please try again.');
                    }
                }
                else {
                    alert('Failed to create address. Please try again.');
                } 
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
                    Street: <input type="text" name="street" value={changes.street} onChange={handleInputChange} />
                    <br></br>
                    City: <input type="text" name="city" value={changes.city} onChange={handleInputChange} />
                    <br></br>
                    State: <select id="state" name="state" value={changes.state} onChange={handleInputChange}>
                                    <option value="CA">CA</option>
                            </select>
                    <br></br>
                    Zipcode: <input type="text" name="zipcode" value={changes.zipcode} size="5" onChange={handleInputChange} />
                    <br></br>
                    Home Phone: <input type="text" name="home_phone" value={changes.home_phone} onChange={handleInputChange} />
                    <br></br>
                    Cell Phone: <input type="text" name="cell_phone" value={changes.cell_phone} onChange={handleInputChange} />
                    <br></br>
                    Email: <input type="text" name="email" value={changes.email} onChange={handleInputChange} />
                    <br></br>
                </div>
                <br></br>
                <Button type="submit" disabled={!validateForm()}>Save</Button>
            </form>
        </>
    )
};