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
                                            FROM school_classes AS sc JOIN student_class_assignments AS sca ON sc.id = sca.school_class_id \
                                            WHERE sca.school_year_id = $1 AND sc.school_class_type != \'ELECTIVE\' group by sc.id, sca.school_class_id, sc.grade_id order by sc.grade_id) \
                                            AS ci ON ci.id = scaf.school_class_id \
                                        JOIN (SELECT ia.school_class_id, p.english_first_name, p.english_last_name, p.chinese_name, a.email, a.home_phone \
                                            FROM instructor_assignments AS ia JOIN people AS p ON p.id = ia.instructor_id \
                                            JOIN families AS f ON f.parent_one_id = p.id OR f.parent_two_id = p.id JOIN addresses AS a ON a.id = \
                                            CASE WHEN p.address_id IS NOT null THEN p.address_id ELSE f.address_id END \
                                            WHERE ia.role = \'Primary Instructor\' AND ia.school_year_id = $1) AS i ON i.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia2.school_class_id, p2.english_first_name, p2.english_last_name, p2.chinese_name, a2.email, a2.home_phone \
                                            FROM instructor_assignments AS ia2 JOIN people AS p2 ON p2.id = ia2.instructor_id \
                                            JOIN families AS f2 ON f2.parent_one_id = p2.id OR f2.parent_two_id = p2.id JOIN addresses AS a2 ON a2.id = \
                                            CASE WHEN p2.address_id IS NOT null THEN p2.address_id ELSE f2.address_id END \
                                            WHERE ia2.role = \'Room Parent\' AND ia2.school_year_id = $1) AS rp ON rp.school_class_id = scaf.school_class_id \
                                        WHERE scaf.active = \'t\' AND scaf.school_year_id = $1 Order by ci.grade_id, ci.english_name;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getStudentCountByElective = async (request, response) => {
    const schoolYearId = request.params.school_year_id; 
    
    try {
        const res = await pool.query('SELECT ci.english_name AS class_english_name, ci.chinese_name AS class_chinese_name, ci.count, ci.location, ci.max_size, ci.min_age, ci.max_age, \
                                            i.english_first_name AS teacher_first_name, i.english_last_name AS teacher_last_name, i.chinese_name AS teacher_chinese_name, \
                                            i.email AS teacher_email, i.home_phone AS teacher_phone ,rp.english_first_name AS parent_first_name, rp.english_last_name AS parent_last_name, \
                                            rp.chinese_name AS parent_chinese_name, rp.email AS parent_email, rp.home_phone AS parent_phone \
                                        FROM school_class_active_flags as scaf \
                                        JOIN (SELECT sc.id, count(sca.school_class_id), sc.english_name, sc.chinese_name, sc.location, sc.max_size, sc.min_age, sc.max_age, sc.grade_id \
                                            FROM school_classes AS sc JOIN student_class_assignments AS sca ON sc.id = sca.elective_class_id \
                                            WHERE sca.school_year_id = $1 AND sc.school_class_type = \'ELECTIVE\' GROUP BY sc.id, sca.elective_class_id, sc.grade_id ORDER BY sc.grade_id) \
                                            AS ci ON ci.id = scaf.school_class_id \
                                        JOIN (SELECT ia.school_class_id, p.english_first_name, p.english_last_name, p.chinese_name, a.email, a.home_phone \
                                            FROM instructor_assignments AS ia JOIN people AS p ON p.id = ia.instructor_id \
                                            JOIN families AS f ON f.parent_one_id = p.id OR f.parent_two_id = p.id JOIN addresses AS a ON a.id = \
                                            CASE WHEN p.address_id IS NOT null THEN p.address_id ELSE f.address_id END \
                                            WHERE ia.role = \'Primary Instructor\' AND ia.school_year_id = $1) AS i ON i.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia2.school_class_id, p2.english_first_name, p2.english_last_name, p2.chinese_name, a2.email, a2.home_phone \
                                            FROM instructor_assignments AS ia2 JOIN people AS p2 ON p2.id = ia2.instructor_id \
                                            JOIN families AS f2 ON f2.parent_one_id = p2.id OR f2.parent_two_id = p2.id JOIN addresses AS a2 ON a2.id =  \
                                            CASE  WHEN p2.address_id IS NOT null THEN p2.address_id ELSE f2.address_id END \
                                            WHERE ia2.role = \'Room Parent\' AND ia2.school_year_id = $1) AS rp ON rp.school_class_id = scaf.school_class_id \
                                        WHERE scaf.active = \'t\' AND scaf.school_year_id = $1 Order by ci.grade_id, ci.english_name;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getActiveClasses = async (request, response) => {
    const schoolYearId = request.params.school_year_id; 
    
    try {
        const res = await pool.query('SELECT sc.id, sc.english_name AS class_english_name, sc.chinese_name AS class_chinese_name, sc.location, \
                                            pi.english_first_name AS teacher_first_name, pi.english_last_name AS teacher_last_name, pi.chinese_name AS teacher_chinese_name \
                                            ,rp.english_first_name AS parent_first_name, rp.english_last_name AS parent_last_name, rp.chinese_name AS parent_chinese_name \
                                            ,si.english_first_name AS teacher2_first_name, si.english_last_name AS teacher2_last_name, si.chinese_name AS teacher2_chinese_name \
                                            ,ta.english_first_name AS ta_first_name, ta.english_last_name AS ta_last_name, ta.chinese_name AS ta_chinese_name \
                                        FROM school_class_active_flags as scaf \
                                        JOIN school_classes AS sc ON sc.id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia.school_class_id, p.english_first_name, p.english_last_name, p.chinese_name \
                                            FROM instructor_assignments AS ia JOIN people AS p ON p.id = ia.instructor_id \
                                            WHERE ia.role = \'Primary Instructor\' AND ia.school_year_id = $1) AS pi ON pi.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia2.school_class_id, p2.english_first_name, p2.english_last_name, p2.chinese_name \
                                            FROM instructor_assignments AS ia2 JOIN people AS p2 ON p2.id = ia2.instructor_id \
                                            WHERE ia2.role = \'Room Parent\' AND ia2.school_year_id = $1) AS rp ON rp.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia3.school_class_id, p3.english_first_name, p3.english_last_name, p3.chinese_name \
                                            FROM instructor_assignments AS ia3 JOIN people AS p3 ON p3.id = ia3.instructor_id \
                                            WHERE ia3.role = \'Secondary Instructor\' AND ia3.school_year_id = $1) AS si ON si.school_class_id = scaf.school_class_id \
                                        FULL JOIN (SELECT ia4.school_class_id, p4.english_first_name, p4.english_last_name, p4.chinese_name \
                                            FROM instructor_assignments AS ia4 JOIN people AS p4 ON p4.id = ia4.instructor_id \
                                            WHERE ia4.role = \'Teaching Assistant\' AND ia4.school_year_id = $1) AS ta ON ta.school_class_id = scaf.school_class_id \
                                        WHERE scaf.active = \'t\' AND scaf.school_year_id = $1 Order by sc.grade_id, sc.english_name;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getAllSchoolClasses = async (request, response) => {
    const schoolYearId = request.params.school_year_id; 
    
    try {
        const res = await pool.query('SELECT sc.id, english_name, chinese_name, short_name, description, location, school_class_type AS type, max_size, min_age, max_age, grade_id, active \
                                        FROM school_classes AS sc JOIN school_class_active_flags AS scaf ON sc.id = scaf.school_class_id WHERE scaf.school_year_id = $1 \
                                        ORDER BY grade_id, english_name;', [schoolYearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getStudentInfoForClass = async (request, response) => {
    const classId = request.params.class_id; 
    const yearId = request.params.school_year_id;
    
    try {
        const res = await pool.query('SELECT s.chinese_name AS student_chinese_name, s.english_last_name AS student_last_name, s.english_first_name AS student_first_name, \
                                            sc.short_name, s.birth_month, s.birth_year, s.gender, p1.chinese_name AS p1_chinese_name, p1.english_last_name AS p1_last_name, p1.english_first_name AS p1_first_name, \
                                            p2.chinese_name AS p2_chinese_name, p2.english_last_name AS p2_last_name, p2.english_first_name AS p2_first_name, a.email, a.home_phone AS phone \
                                        FROM student_class_assignments AS sca FULL JOIN school_classes AS sc ON sc.id = sca.school_class_id\
                                        JOIN people AS s ON sca.student_id = s.id \
                                        FULL JOIN (SELECT fc.child_id, chinese_name, english_last_name, english_first_name \
                                            FROM people AS p JOIN families AS f ON p.id = f.parent_one_id \
                                            JOIN families_children AS fc ON f.id = fc.family_id) AS p1 ON p1.child_id = s.id \
                                        FULL JOIN (SELECT fc.child_id, chinese_name, english_last_name, english_first_name \
                                            FROM people AS p JOIN families AS f ON p.id = f.parent_two_id \
                                            JOIN families_children AS fc ON f.id = fc.family_id) AS p2 ON p2.child_id = s.id \
                                        JOIN (SELECT fc.child_id, a.email, a.home_phone \
                                            FROM addresses AS a JOIN families AS f on a.id = f.address_id \
                                            JOIN families_children AS fc ON f.id = fc.family_id) AS a ON a.child_id = s.id \
                                        WHERE (sca.school_class_id = $1 OR sca.elective_class_id = $1) AND sca.school_year_id = $2 ORDER BY s.english_last_name;', [classId, yearId]);
        response.status(200).json(res.rows);
    }
    catch (error) {
        throw error;
    }
}

const getClassInfoForClass = async (request, response) => {
    const classId = request.params.class_id; 
    const yearId = request.params.school_year_id;
    
    try {
        const res = await pool.query('SELECT i.chinese_name AS teacher_chinese_name, i.english_first_name AS teacher_first_name, i.english_last_name AS teacher_last_name, \
                                        sc.chinese_name AS class_name, sc.location, sc.school_class_type AS type, rp.chinese_name AS rp_chinese_name, \
                                        rp.english_first_name AS rp_first_name, rp.english_last_name AS rp_last_name \
                                        FROM instructor_assignments AS ia JOIN people AS i ON i.id = ia.instructor_id AND ia.role = \'Primary Instructor\' \
                                        JOIN school_classes AS sc ON sc.id = ia.school_class_id FULL JOIN (SELECT ia.school_class_id, chinese_name, english_last_name, english_first_name \
                                        FROM instructor_assignments AS ia JOIN people AS p ON p.id = ia.instructor_id AND ia.school_year_id = $2 WHERE ia.role = \'Room Parent\') \
                                        AS rp ON rp.school_class_id = ia.school_class_id WHERE ia.school_class_id = $1 AND ia.school_year_id = $2;', [classId, yearId]);
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
directoriesRouter.get('/studentcount/elective/:school_year_id', getStudentCountByElective);
directoriesRouter.get('/classes/active/:school_year_id', getActiveClasses);
directoriesRouter.get('/classes/all/:school_year_id', getAllSchoolClasses);
directoriesRouter.get('/studentlist/class/:class_id/:school_year_id', getStudentInfoForClass);
directoriesRouter.get('/info/class/:class_id/:school_year_id', getClassInfoForClass);

module.exports = directoriesRouter;