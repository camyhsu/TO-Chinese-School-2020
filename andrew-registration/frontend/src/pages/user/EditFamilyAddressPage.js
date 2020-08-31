import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function EditFamilyAddressPage() {
    const url = window.location.href.split("/");
    const personId = url[url.length-1];
    const { userData, setUserData, setStatus } = useAppContext(); 
    const history = useHistory();  

    const [parentDetails, setParentDetails] = useState([{}]);
    const [familyDetails, setFamilyDetails] = useState();
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
                const familyResponse = await fetch(`/user/family/address?id=${personId}`);
                var family = await familyResponse.json();
                setFamilyDetails(family[0]);
                setStreet(family[0].street);
                setCity(family[0].city);
                setState(family[0].state);
                setZipcode(family[0].zipcode);
                setHomePhone(family[0].home_phone);
                setCellPhone(family[0].cell_phone);
                setEmail(family[0].email);
                const parentResponse = await fetch(`/user/parent/data?id=${family[0].family_id}`);
                var parents = await parentResponse.json();
                setParentDetails(parents);
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
                const patchResponse = await fetch(`/user/address/edit/${familyDetails.address_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( body )                                        
                });

                if( patchResponse.status === 200 ) {
                    if(parseInt(personId,10) === userData.person.personId) {
                        const familyAddressDataResponse = await fetch(`/user/family/address?id=${personId}`);
                        var familyAddressData = await familyAddressDataResponse.json();
                        setUserData(prevUserData => ({...prevUserData,
                            family: {
                                familyId: userData.family.familyId,
                                addressId: userData.family.addressId,
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
                    }
                    setStatus('Family Address Successfully Updated.');
                    history.goBack();
                }
                else {
                    alert('Failed to update family address. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        }
        patchData();
    }


    return (
        <>
            <h1>Edit Family Address Details</h1>
            <h3>Parent One: {parentDetails[0].chinese_name} ({parentDetails[0].english_first_name} {parentDetails[0].english_last_name})</h3>
            {parentDetails.length === 1 ? <h3>Parent Two: </h3> : <h3>Parent Two: {parentDetails[1].chinese_name} ({parentDetails[1].english_first_name} {parentDetails[1].english_last_name})</h3>}
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