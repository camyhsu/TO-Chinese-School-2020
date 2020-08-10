const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'tocsorg_camyhsu',
    host: 'localhost',
    database: 'chineseschool_development',
    password: 'root',
    port: 5432,
})


const getPeopleByEmail = async (request, response) => {
    const emailAddress = request.params.email;
    
    try {
        const res = await pool.query("SELECT * FROM people FULL JOIN addresses ON people.address_id = addresses.id WHERE email LIKE '%" + emailAddress + "%'");
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getPeopleByChineseName = async (request, response) => {
    const chineseName = request.params.chineseName;

    try {
        const res = await pool.query('SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                        FROM people FULL JOIN addresses ON people.address_id = null \
                                        OR people.address_id = addresses.id WHERE chinese_name = $1', [chineseName]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getPeopleByEnglishName = async (request, response) => {
    const firstAndLast = request.params.first_last;
    const nameArr = firstAndLast.split(/(?=[A-Z])/);

    try {
        // if only one name is given, search for the name in first and last names
        if( nameArr.length == 1 ) {
            const name = nameArr[0];
    
            const res = await pool.query("SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                            FROM people FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id \
                                            WHERE english_first_name LIKE '%" + name + "%' or english_last_name LIKE '%" + name + "%'");
            response.status(200).json(res.rows);
        }
        // take the first and last names in the query as the first and last name, respectively
        else {
            const firstName = nameArr[0];
            const lastName = nameArr[nameArr.length - 1];
        
            const res = await pool.query('SELECT english_first_name, english_last_name, chinese_name, email, gender, birth_month, birth_year, native_language \
                                            FROM people FULL JOIN addresses ON people.address_id = null OR people.address_id = addresses.id \
                                            WHERE english_first_name = $1 AND english_last_name = $2', [firstName, lastName]);
            response.status(200).json(res.rows);
        }

    }
    catch (error) {
        throw error;
    }
}

const getGrades = async (request, response) => {
    const emailAddress = request.params.email;
    
    try {
        const res = await pool.query('SELECT chinese_name, english_name, short_name FROM grades;');
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getStudentCountByGrade = async (request, response) => {
    const schoolYearId = request.params.school_year_id;
    
    try {
        const res = await pool.query('SELECT chinese_name, english_name, count(grades.id), max_table.sum as max FROM grades \
                                        INNER JOIN student_class_assignments AS sca ON grades.id = sca.grade_id \
                                        INNER JOIN (SELECT grade_id, sum(max_size) FROM school_class_active_flags AS scaf \
                                        INNER JOIN school_classes ON school_classes.id = scaf.school_class_id WHERE \
                                        school_year_id = $1 AND active = \'t\' AND school_class_type != \'ELECTIVE\' \
                                        GROUP BY school_classes.grade_id ORDER BY grade_id) as max_table ON max_table.grade_id = grades.id \
                                        WHERE sca.school_year_id = $1 GROUP BY chinese_name, english_name, grades.id, max_table.sum ORDER BY grades.id;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getStudentCountByClass = async (request, response) => {
    const schoolYearId = request.params.school_year_id;
    
    try {
        const res = await pool.query('SELECT ci.english_name AS class_english_name, ci.chinese_name AS class_chinese_name, ci.count, ci.location, ci.max_size, ci.min_age, ci.max_age, \
                                            i.english_first_name AS teacher_first_name, i.english_last_name AS teacher_last_name, i.chinese_name AS teacher_chinese_name, \
                                            i.email AS teacher_email, i.home_phone AS teacher_phone, rp.english_first_name AS parent_first_name, rp.english_last_name AS parent_last_name, \
                                            rp.chinese_name AS parent_chinese_name, rp.email AS parent_email, rp.home_phone AS parent_phone \
                                        FROM school_class_active_flags as scaf \
                                        JOIN (SELECT sc.id, count(sca.school_class_id), sc.english_name, sc.chinese_name, sc.location, sc.max_size, sc.min_age, sc.max_age, sc.grade_id \
                                                FROM school_classes AS sc \
                                                JOIN student_class_assignments AS sca ON sc.id = sca.school_class_id \
                                                WHERE sca.school_year_id = $1 AND sc.school_class_type != \'ELECTIVE\' \
                                                group by sc.id, sca.school_class_id, sc.grade_id order by sc.grade_id) \
                                                AS ci ON ci.id = scaf.school_class_id \
                                        JOIN (SELECT ia.school_class_id, p.english_first_name, p.english_last_name, p.chinese_name, a.email, a.home_phone \
                                            FROM instructor_assignments AS ia \
                                            JOIN people AS p ON p.id = ia.instructor_id \
                                            JOIN families AS f ON f.parent_one_id = p.id OR f.parent_two_id = p.id \
                                            JOIN addresses AS a ON a.id = \
	  		                                    CASE \
                                                    WHEN p.address_id IS NOT null THEN p.address_id \
                                                    ELSE f.address_id \
                                                END \
                                            WHERE ia.role = \'Primary Instructor\' AND ia.school_year_id = $1) \
                                            AS i ON i.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia2.school_class_id, p2.english_first_name, p2.english_last_name, p2.chinese_name, a2.email, a2.home_phone \
                                            FROM instructor_assignments AS ia2 \
                                            JOIN people AS p2 ON p2.id = ia2.instructor_id \
                                            JOIN families AS f2 ON f2.parent_one_id = p2.id OR f2.parent_two_id = p2.id \
                                            JOIN addresses AS a2 ON a2.id = \
                                                CASE \
                                                    WHEN p2.address_id IS NOT null THEN p2.address_id \
                                                    ELSE f2.address_id \
                                                END \
                                            WHERE ia2.role = \'Room Parent\' AND ia2.school_year_id = $1) \
                                            AS rp ON rp.school_class_id = scaf.school_class_id \
                                        WHERE scaf.active = \'t\' AND scaf.school_year_id = $1 Order by ci.grade_id, ci.english_name;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const directoriesRouter = express.Router();
directoriesRouter.get('/people/email/:email', getPeopleByEmail);
directoriesRouter.get('/people/chineseName/:chineseName', getPeopleByChineseName);
directoriesRouter.get('/people/englishName/:first_last', getPeopleByEnglishName);
directoriesRouter.get('/grades', getGrades);
directoriesRouter.get('/studentcount/grades/:school_year_id', getStudentCountByGrade);
directoriesRouter.get('/studentcount/class/:school_year_id', getStudentCountByClass);

module.exports = directoriesRouter;