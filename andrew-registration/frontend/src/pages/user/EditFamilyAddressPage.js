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
    const [changes, setChanges] = useState({
        address_id: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        home_phone: '',
        cell_phone: '',
        email: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const familyResponse = await fetch(`/user/family/address?id=${personId}`);
                if(familyResponse.status === 200) {
                    var family = await familyResponse.json();
                    setFamilyDetails(family[0]);
                    setChanges(family[0]);
                }
                else {
                    alert('Failed to get family address. Please try again.');
                }
                
                const parentResponse = await fetch(`/user/parent/data?id=${family[0].family_id}`);
                if(parentResponse.status === 200) {
                    var parents = await parentResponse.json();
                    setParentDetails(parents);
                }
                else {
                    alert('Failed to get parent data. Please try again.')
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
        const patchData = async () => {
            try {
                const patchResponse = await fetch(`/user/address/edit/${familyDetails.address_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'PATCH',                                                              
                    body: JSON.stringify( changes )                                        
                });

                if( patchResponse.status === 200 ) {
                    if(parseInt(personId,10) === userData.personalData.personId) {
                        const familyAddressDataResponse = await fetch(`/user/family/address?id=${personId}`);
                        var familyAddressData = await familyAddressDataResponse.json();
                        setUserData(prevUserData => ({...prevUserData,
                            familyAddress: {
                                familyId: userData.familyAddress.familyId,
                                addressId: userData.familyAddress.addressId,
                                cccaLifetimeMember: userData.familyAddress.cccaLifetimeMember,
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