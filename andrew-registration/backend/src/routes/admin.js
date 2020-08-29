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

const verifyUserSignIn = async (request, response, next) => {
    const username = request.query.username;

    if( !username )
        return response.status(400).json({message: 'Username is required'});

    try {
        const res = await pool.query('SELECT person_id, password_hash, password_salt FROM users WHERE username = $1', [username]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const changePassword = async (request, response, next) => {
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

const addPerson = async (request, response, next) => {
    const body = await readBody(request);
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = JSON.parse(body);

    try {
        const res = await pool.query('INSERT INTO people (english_last_name, english_first_name, chinese_name, gender, birth_year, birth_month, native_language) \
                                        VALUES ($1, $2, $3, $4, $5, $6, $7);', [englishLastName, englishFirstName, chineseName, gender, birthYear, birthMonth, nativeLanguage]);
        response.status(201).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const addAddress = async (request, response, next) => {
    const body = await readBody(request);
    const { street, city, state, zipcode, homePhone, cellPhone, email } = JSON.parse(body);

    try {
        const res = await pool.query('INSERT INTO addresses (street, city, state, zipcode, home_phone, cell_phone, email) \
                                        VALUES ($1, $2, $3, $4, $5, $6, $7);', [street, city, state, zipcode, homePhone, cellPhone, email]);
        response.status(201).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const changeClassActiveStatus = async (request, response, next) => {
    const class_id = request.params.class_id;
    const year_id = request.params.year_id;
    const body = await readBody(request);
    const { active } = JSON.parse(body);

    try {
        const res = await pool.query('UPDATE school_class_active_flags SET active = $1 WHERE school_class_id = $2 AND school_year_id = $3;', [active, class_id, year_id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const adminRouter = express.Router();
adminRouter.get('/signin', verifyUserSignIn);
adminRouter.patch('/password/edit/:username', changePassword);
adminRouter.post('/people/add', addPerson);
adminRouter.post('/address/add', addAddress);
adminRouter.patch('/class/active/edit/:year_id/:class_id', changeClassActiveStatus);

module.exports = adminRouter;