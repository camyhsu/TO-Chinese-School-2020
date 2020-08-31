const {sha256} = require('js-sha256');
const { prependOnceListener } = require('process');

users = [
    {
        username: 'username',
        password_hash: 'b446ed593c5bf381d37bfacdca99b42b433ee07a53cf7eb88295398daeb914e2',
        password_salt: '2Yj1ti0C',
        person_id: 123
    }
]

const verifyUserSignIn = async (request, response, next) => {
    const qUsername = request.query.username;
    const password = request.query.password;

    if( !qUsername )
        return response.status(400).json({message: 'Username is required'});
    if( !password )
        return response.status(400).json({message: 'Password is required'});

    try {
        var user = users.find(({username}) => username === qUsername);
        if( !user )
            return response.status(404).json({message: `No user found with username: ${qUsername}`});
        var saltedPass = password + user.password_salt;
        if(sha256(saltedPass) === user.password_hash)
            return response.status(200).json(user.person_id);
        else
            return response.status(401).json({message: `Sign in failed`});
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const changePassword = async (request, response, next) => {
    const qUsername = request.params.username;
    const password = request.body.password;

    if( !qUsername )
        return response.status(400).json({message: 'Username is required'});
    if( !password )
        return response.status(400).json({message: 'Password is required'});
    
    const crypto = require('crypto');
    var generateSalt = function(length) {
        return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length); 
    }
    var password_salt = generateSalt(8);
    var password_hash = sha256(password + password_salt);

    try {
        var user = users.find(({username}) => username === qUsername);
        if( !user )
            return response.status(404).json({message: `No user found with username: ${qUsername}`});
        var userIndex = users.indexOf(user);
        user.password_hash = password_hash
        user.password_salt = password_salt
        users.splice(userIndex, userIndex, user);
        return response.status(200).json([]);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

module.exports = {
    verifyUserSignIn,
    changePassword,
};