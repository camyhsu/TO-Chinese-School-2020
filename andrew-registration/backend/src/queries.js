const { Client } = require('pg');

const getPeopleByEmail = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const emailAddress = request.params.email;
    
    try {
        const res = await client.query("SELECT * FROM people FULL JOIN addresses ON people.address_id = addresses.id WHERE email LIKE '%" + emailAddress + "%'");
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getPeopleByChineseName = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const chineseName = request.params.chineseName;

    try {
        const res = await client.query('SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                        FROM people FULL JOIN addresses ON people.address_id = null \
                                        OR people.address_id = addresses.id WHERE chinese_name = $1', [chineseName]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }   
}

const getPeopleByEnglishName = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();

    const firstAndLast = request.params.first_last;
    const nameArr = firstAndLast.split(/(?=[A-Z])/);
    try {
        // if only one name is given, search for the name in first and last names
        if( nameArr.length == 1 ) {
            const name = nameArr[0];
    
            const res = await client.query("SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                            FROM people FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id \
                                            WHERE english_first_name LIKE '%" + name + "%' or english_last_name LIKE '%" + name + "%'");
            response.status(200).json(res.rows);
        }
        // take the first and last names in the query as the first and last name, respectively
        else {
            const firstName = nameArr[0];
            const lastName = nameArr[nameArr.length - 1];
        
            const res = await client.query('SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                            FROM people FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id \
                                            WHERE english_first_name = $1 AND english_last_name = $2', [firstName, lastName]);
            response.status(200).json(res.rows);
        }

    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getGrades = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const emailAddress = request.params.email;
    
    try {
        const res = await client.query('SELECT chinese_name, english_name, short_name FROM grades;');
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const verifyUserSignIn = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const username = request.params.username;

    try {
        const res = await client.query('SELECT person_id, password_hash, password_salt FROM users WHERE username = $1', [username]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getUserData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;

    try {
        const res = await client.query('SELECT english_first_name, english_last_name, chinese_name, gender, birth_year, birth_month, \
                                        native_language, address_id, street, city, state, zipcode, home_phone, cell_phone, email FROM people \
                                        FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id WHERE people.id = $1', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getParentData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;
    try {
        const res = await client.query('SELECT families.id as family_id, english_first_name, english_last_name, chinese_name FROM people JOIN families \
                                        ON parent_one_id = $1 or parent_two_id = $1 WHERE \
                                        (SELECT parent_one_id FROM families WHERE parent_two_id = $1) = people.id OR \
                                        (SELECT parent_two_id FROM families WHERE parent_one_id = $1) = people.id;', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getFamilyAddressData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;
    try {
        const res = await client.query('SELECT id, street, city, state, zipcode, home_phone, cell_phone, email FROM addresses \
                                        WHERE addresses.id = (SELECT address_id FROM families WHERE parent_one_id = $1 or parent_two_id = $1)', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const getStudentData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;
    try {
        const res = await client.query('SELECT people.id, english_first_name, english_last_name, chinese_name, gender, birth_month, birth_year, native_language \
                                        FROM people WHERE people.id IN (SELECT child_id FROM families_children WHERE families_children.family_id = \
                                        (SELECT id FROM families WHERE parent_one_id = $1 OR parent_two_id = $1));', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const patchUserData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = request.body;
    try {
        const res = await client.query('UPDATE people \
                                        SET english_first_name = $1, english_last_name = $2, chinese_name = $3, birth_year = $4, birth_month = $5, gender = $6, native_language = $7 \
                                        WHERE id = $8', [englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage, id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const patchAddress = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.address_id;
    const { street, city, state, zipcode, homePhone, cellPhone, email } = request.body;
    try {
        const res = await client.query('UPDATE addresses \
                                        SET street = $1, city = $2, state = $3, zipcode = $4, home_phone = $5, cell_phone = $6, email = $7 \
                                        WHERE id = $8', [street, city, state, zipcode, homePhone, cellPhone, email, id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const changePassword = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const username = request.params.username;
    const { password_hash, password_salt } = request.body;
    try {
        const res = await client.query('UPDATE users SET password_hash = $1, password_salt = $2 WHERE username = $3',[password_hash, password_salt, username]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const addPerson = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = request.body;
    try {
        const res = await client.query('INSERT INTO people (english_last_name, english_first_name, chinese_name, gender, birth_year, birth_month, native_language) \
                                        VALUES ($1, $2, $3, $4, $5, $6, $7);', [englishLastName, englishFirstName, chineseName, gender, birthYear, birthMonth, nativeLanguage]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

const addChild = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.family_id;
    const { englishFirstName, englishLastName, chineseName, birthYear, birthMonth, gender, nativeLanguage } = request.body;
    try {
        const res = await client.query('INSERT INTO families_children (family_id, child_id) VALUES ($1, \
                                        (SELECT id FROM people WHERE english_last_name = $2 and english_first_name = $3 and chinese_name = $4 and \
                                        gender = $5 and birth_year = $6 and birth_month = $7 and native_language = $8));'
                                        , [id, englishLastName, englishFirstName, chineseName, gender, birthYear, birthMonth, nativeLanguage]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

module.exports = {
    getPeopleByEmail,
    getPeopleByChineseName,
    getPeopleByEnglishName,
    getGrades,
    verifyUserSignIn,
    getUserData,
    getParentData,
    getFamilyAddressData,
    getStudentData,
    patchUserData,
    patchAddress,
    changePassword,
    addPerson,
    addChild,
}
