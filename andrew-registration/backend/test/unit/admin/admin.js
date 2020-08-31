const {sha256} = require('js-sha256');

users = [
    {
        username: 'username',
        password_hash: 'b446ed593c5bf381d37bfacdca99b42b433ee07a53cf7eb88295398daeb914e2',
        password_salt: '2Yj1ti0C',
        person_id: 123
    }
]

people = [
    {
        person_id: 123,
        english_first_name: 'andrew',
        english_last_name: 'last',
        gender: 'F'
    }
]

addresses = [
    {
        address_id: 123,
        street: 'Street',
        city: 'City',
        state: 'State',
        zipcode: '12345',
        home_phone: '1234567890',
        email: 'email'
    }
]

school_class_active_flags = [
    {
        class_id: 1,
        year_id: 10,
        active: 't'
    },
    {
        class_id: 2,
        year_id: 10,
        active: 'f'
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


const makeChanges = (temp, data) => {
    for(key in data) {
        if(data[key])
            temp[key] = data[key];
    }
    return temp;
}
 
const addPerson = async (request, response, next) => {
    const body = request.body;

    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'Body is required'});

    try {
        var newPerson = makeChanges({}, body);
        newPerson.person_id = 999;
        people.splice(0,0, newPerson)
        return response.status(201).json([]);
    }
    catch (error) {
        throw error;
    }
}

const addAddress = async (request, response, next) => {
    const body = request.body;

    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'Body is required'});

    try {
        var newAddress = makeChanges({}, body);
        newAddress.address_id = 999;
        addresses.splice(0,0, newAddress)
        return response.status(201).json([]);
    }
    catch (error) {
        throw error;
    }
}

const changeClassActiveStatus = async (request, response, next) => {
    const qClass_id = request.params.class_id;
    const qYear_id = request.params.year_id;
    const body = request.body;
    
    if( !qClass_id )
        return response.status(400).json({message: 'Class id is required'});
    if( !qYear_id )
        return response.status(400).json({message: 'School year id is required'});
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'Body is required'});

    try {
        var schoolClass = school_class_active_flags.find(({class_id, year_id}) => class_id === qClass_id && year_id === qYear_id);
        if( !schoolClass )
            return response.status(404).json({message: `Class not found with class id: ${qClass_id} and year id: ${qYear_id}`});
        schoolClass.active = body.active;
        return response.status(200).json([]);
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    verifyUserSignIn,
    changePassword,
    addPerson,
    addAddress,
    changeClassActiveStatus
};