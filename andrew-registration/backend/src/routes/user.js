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

const getUserData = async (request, response, next) => {
    const id = request.query.id;
    
    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        const res = await pool.query('SELECT users.username, english_first_name, english_last_name, chinese_name, gender, birth_month, birth_year, native_language \
                                        FROM people FULL JOIN users ON people.id = users.person_id WHERE people.id = $1;', [id]);
        if (res.rows.length === 0)
            return response.status(404).json({message: `No user found with id: ${id}`});
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getUserAddress = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        const res = await pool.query('SELECT id AS address_id, street, city, state, zipcode, home_phone, cell_phone, email \
                                        FROM addresses WHERE addresses.id = (SELECT address_id FROM people WHERE people.id = $1);', [id]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getParentData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        const res = await pool.query('SELECT people.id AS person_id, english_first_name, english_last_name, chinese_name, username FROM people JOIN users ON users.person_id = people.id \
                                        JOIN families ON families.parent_one_id = people.id OR families.parent_two_id = people.id WHERE families.id = $1;', [id]);
        if (res.rows.length === 0)
            return response.status(404).json({message: `No parents found for family id: ${id}`});
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getFamilyAddress = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        const res = await pool.query('SELECT families.id AS family_id, addresses.id AS address_id, street, city, state, zipcode, home_phone, cell_phone, email, ccca_lifetime_member \
                                        FROM addresses JOIN families ON families.address_id = addresses.id WHERE parent_one_id = $1 or parent_two_id = $1;', [id]);
        if (res.rows.length === 0)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getFamilyAddressFromChild = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        const res = await pool.query('SELECT families.id as family_id, street, city, state, zipcode, home_phone, cell_phone, email FROM addresses JOIN families \
                                        ON families.address_id = addresses.id WHERE families.id = (SELECT family_id FROM families_children WHERE child_id = $1);', [id]);
        if (res.rows.length === 0)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStudentData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        const res = await pool.query('SELECT people.id, english_first_name, english_last_name, chinese_name, gender, birth_month, birth_year, native_language \
                                        FROM people WHERE people.id IN (SELECT child_id FROM families_children WHERE families_children.family_id = $1);', [id]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const patchUserData = async (request, response, next) => {
    const id = request.params.person_id;
    if( !id )
        return response.status(400).json({message: 'Person id is required'});
    const body = await readBody(request);
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});
    const { english_first_name, english_last_name, chinese_name, birth_year, birth_month, gender, native_language } = JSON.parse(body);

    try {
        const res = await pool.query('UPDATE people SET english_first_name = $1, english_last_name = $2, chinese_name = $3, birth_year = $4, birth_month = $5, \
                            gender = $6, native_language = $7, updated_at = NOW() WHERE id = $8', [english_first_name, english_last_name, chinese_name, birth_year, birth_month, gender, native_language, id]);
        return response.status(200).json(res);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const patchAddress = async (request, response, next) => {
    const id = request.params.address_id;
    if( !id )
        return response.status(400).json({message: 'Address id is required'});
    const body = await readBody(request);
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});
    const { street, city, state, zipcode, home_phone, cell_phone, email } = JSON.parse(body);

    try {
        const res = await pool.query('UPDATE addresses SET street = $1, city = $2, state = $3, zipcode = $4, home_phone = $5, cell_phone = $6, email = $7, updated_at = NOW() \
                                        WHERE id = $8', [street, city, state, zipcode, home_phone, cell_phone, email, id]);
        return response.status(200).json(res);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const addChild = async (request, response, next) => {
    const id = request.params.family_id;
    if( !id )
        return response.status(400).json({message: 'Family id is required'});
    const body = await readBody(request);
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});
    const { english_first_name, english_last_name, chinese_name, birth_year, birth_month, gender, native_language } = JSON.parse(body);
    
    try {
        const res = await pool.query('INSERT INTO families_children (family_id, child_id, created_at, updated_At) VALUES ($1, (SELECT id FROM people WHERE \
                                        english_first_name = $2 and english_last_name = $3 and chinese_name = $4 and birth_year = $5 and \
                                        birth_month = $6 and gender = $7 and native_language = $8), NOW(), NOW());',
                                        [id, english_first_name, english_last_name, chinese_name, birth_year, birth_month, gender, native_language]);
        return response.status(201).json(res);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const addAddress = async (request, response, next) => {
    const id = request.params.person_id;
    if( !id )
        return response.status(400).json({message: 'Id is required'});
    const body = await readBody(request);
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});
    const { street, city, state, zipcode, home_phone, cell_phone, email } = JSON.parse(body);
    
    try {
        const res = await pool.query('UPDATE people SET address_id = (SELECT id FROM addresses WHERE street = $1 and city = $2 and state = $3 and zipcode = $4 and \
                            home_phone = $5 and cell_phone = $6 and email = $7), updated_at = NOW() WHERE people.id = $8;', 
                            [street, city, state, zipcode, home_phone, cell_phone, email, id]);
        return response.status(201).json(res);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const userRouter = express.Router();
userRouter.get('/data', getUserData);
userRouter.get('/address', getUserAddress);
userRouter.get('/parent/data', getParentData);
userRouter.get('/family/address', getFamilyAddress);
userRouter.get('/family/address/fromchild', getFamilyAddressFromChild);
userRouter.get('/student/data', getStudentData);
userRouter.patch('/data/edit/:person_id', patchUserData);
userRouter.patch('/address/edit/:address_id', patchAddress);
userRouter.post('/family/child/add/:family_id', addChild);
userRouter.post('/address/add/:person_id', addAddress);

module.exports = userRouter;