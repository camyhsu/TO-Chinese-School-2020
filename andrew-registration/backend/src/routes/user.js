const express = require('express');
const readBody = require('../lib/read-body');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'tocsorg_camyhsu',
    host: 'localhost',
    database: 'chineseschool_development',
    password: 'root',
    port: 5432,
})

const getUserData = async (request, response) => {
    const id = request.params.person_id;

    try {
        const res = await pool.query('SELECT english_first_name, english_last_name, chinese_name, gender, birth_year, birth_month, \
                                        native_language, address_id, street, city, state, zipcode, home_phone, cell_phone, email FROM people \
                                        FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id WHERE people.id = $1', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getParentData = async (request, response) => {
    const id = request.params.person_id;

    try {
        const res = await pool.query('SELECT families.id as family_id, english_first_name, english_last_name, chinese_name FROM people JOIN families \
                                        ON parent_one_id = $1 or parent_two_id = $1 WHERE \
                                        (SELECT parent_one_id FROM families WHERE parent_two_id = $1) = people.id OR \
                                        (SELECT parent_two_id FROM families WHERE parent_one_id = $1) = people.id;', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getFamilyAddressData = async (request, response) => {
    const id = request.params.person_id;

    try {
        const res = await pool.query('SELECT id, street, city, state, zipcode, home_phone, cell_phone, email FROM addresses \
                                        WHERE addresses.id = (SELECT address_id FROM families WHERE parent_one_id = $1 or parent_two_id = $1)', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getStudentData = async (request, response) => {
    const id = request.params.person_id;

    try {
        const res = await pool.query('SELECT people.id, english_first_name, english_last_name, chinese_name, gender, birth_month, birth_year, native_language \
                                        FROM people WHERE people.id IN (SELECT child_id FROM families_children WHERE families_children.family_id = \
                                        (SELECT id FROM families WHERE parent_one_id = $1 OR parent_two_id = $1));', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const patchUserData = async (request, response) => {
    const body = await readBody(request);
    const id = request.params.person_id;
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = JSON.parse(body);

    try {
        const res = await pool.query('UPDATE people \
                                        SET english_first_name = $1, english_last_name = $2, chinese_name = $3, birth_year = $4, birth_month = $5, gender = $6, native_language = $7 \
                                        WHERE id = $8', [englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage, id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const patchAddress = async (request, response) => {
    const body = await readBody(request);
    const id = request.params.address_id;
    const { street, city, state, zipcode, homePhone, cellPhone, email } = JSON.parse(body);

    try {
        const res = await pool.query('UPDATE addresses \
                                        SET street = $1, city = $2, state = $3, zipcode = $4, home_phone = $5, cell_phone = $6, email = $7 \
                                        WHERE id = $8', [street, city, state, zipcode, homePhone, cellPhone, email, id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const changePassword = async (request, response) => {
    const body = await readBody(request);
    const username = request.params.username;
    const { password_hash, password_salt } = JSON.parse(body);
    
    try {
        const res = await pool.query('UPDATE users SET password_hash = $1, password_salt = $2 WHERE username = $3',[password_hash, password_salt, username]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const addChild = async (request, response) => {
    const body = await readBody(request);
    const id = request.params.family_id;
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = JSON.parse(body);
    
    try {
        const res = await pool.query('INSERT INTO families_children (family_id, child_id) VALUES ($1, \
                                        (SELECT id FROM people WHERE english_last_name = $2 and english_first_name = $3 and chinese_name = $4 and \
                                        gender = $5 and birth_year = $6 and birth_month = $7 and native_language = $8));'
                                        , [id, englishLastName, englishFirstName, chineseName, gender, birthYear, birthMonth, nativeLanguage]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const userRouter = express.Router();
userRouter.get('/userdata/:person_id', getUserData);
userRouter.get('/parentdata/:person_id', getParentData);
userRouter.get('/familyaddressdata/:person_id', getFamilyAddressData);
userRouter.get('/studentdata/:person_id', getStudentData);
userRouter.patch('/userdata/edit/details/:person_id', patchUserData);
userRouter.patch('/userdata/edit/address/:address_id', patchAddress);
userRouter.patch('/userdata/edit/password/:username', changePassword);
userRouter.post('/family/addchild/:family_id', addChild);

module.exports = userRouter;