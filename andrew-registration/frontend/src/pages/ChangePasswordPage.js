import React, { useState } from 'react';
import { useAppContext } from '../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { sha256 } from 'js-sha256';


export default function ChangePasswordPage() {
    const { userData, setStatus } = useAppContext(); 
    const history = useHistory();  
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function validateForm() {
        return oldPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const fetch = require("node-fetch");
        const patchData = async () => {
            try {
                const signInResponse = await fetch(`/admin/signin/username/${userData.person.username}`);
                var hash = await signInResponse.json();
                const pass_salt = oldPassword + hash[0].password_salt;

                if(sha256(pass_salt) === hash[0].password_hash) {

                    const crypto = require('crypto');
                    var generateSalt = function(length) {
                        return crypto.randomBytes(Math.ceil(length/2))
                            .toString('hex')
                            .slice(0,length); 
                    }
                    const salt = generateSalt(8);
                    // create body for patch request
                    var body = {};
                    body.password_hash = sha256(newPassword + salt);
                    body.password_salt = salt;

                    await fetch(`/person/userdata/edit/password/${userData.person.username}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'PATCH',                                                              
                        body: JSON.stringify( body )                                 
                    });
                    setStatus('Password Successfully Changed.');
                    history.push('/registration');
                }
                else {
                    alert('Incorrect Password.');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        patchData();
        
    }


    return (
        <>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    Old Password: <input type="text" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <br></br>
                    New Password: <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <br></br>
                    Confirm New Password: <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <br></br>
                </div>
                <br></br>
                <Button type="submit" disabled={!validateForm()}>Save</Button>
            </form>
        </>
    )
};