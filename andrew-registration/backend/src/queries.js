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
        const res = await client.query('SELECT * FROM people FULL JOIN addresses ON people.address_id = addresses.id WHERE email = $1', [emailAddress]);
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
                                        native_language, street, city, state, zipcode, home_phone, cell_phone, email FROM people \
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

const getFamilyData = async (request, response) => {
    const client = new Client({
        user: 'tocsorg_camyhsu',
        host: 'localhost',
        database: 'chineseschool_development',
        password: 'root',
        port: 5432,
    });
    await client.connect();
    const id = request.params.person_id;
    // select distinct english_first_name, english_last_name, chinese_name, street, city, state, zipcode, home_phone, cell_phone, email
    // from people, addresses, families, families_children
    // where families.address_id = addresses.id and (families.parent_one_id = 938 or families.parent_two_id = 938) and (families_children.family_id = families.id)
    // and (families_children.child_id = people.id or families.parent_one_id = people.id or families.parent_two_id = people.id);
    try {
        const res = await client.query('SELECT * FROM people FULL JOIN addresses ON people.address_id = null OR \
                                        people.address_id = addresses.id WHERE people.id = $1', [id]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
    finally {
        await client.end();
    }
}

module.exports ={
    getPeopleByEmail,
    getPeopleByChineseName,
    getPeopleByEnglishName,
    verifyUserSignIn,
    getUserData,
    getFamilyData,
}
