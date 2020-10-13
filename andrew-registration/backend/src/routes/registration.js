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

const getStudentRegistrationData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        const res = await pool.query('SELECT people.id, english_first_name, english_last_name, chinese_name, birth_month, birth_year, prev_grade FROM people \
                    FULL JOIN (SELECT people.id, MAX(grade_id) as prev_grade FROM people FULL JOIN student_class_assignments AS sca ON people.id = sca.student_id \
                    GROUP BY people.id) as grades ON grades.id = people.id WHERE people.id IN (SELECT child_id FROM families_children WHERE families_children.family_id = $1);', [id]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getElectiveAvailability = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'School year id is required'});

    try {
        const res = await pool.query('SELECT sc.id, sc.english_name, sc.chinese_name FROM school_classes as sc, student_class_assignments as sca \
                    WHERE sca.elective_class_id = sc.id AND sca.school_year_id = $1 GROUP BY sc.id HAVING COUNT(sca.student_id) < sc.max_size;', [id]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getGrades = async (request, response, next) => {
    try {
        const res = await pool.query('SELECT id, chinese_name, english_name, next_grade FROM grades;');
        if (res.rows.length === 0)
            return response.status(404).json({message: `No grades found.`});
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStaffStatus = async (request, response, next) => {
    const user = request.query.user;
    const year = request.query.year;

    if( !user )
        return response.status(400).json({message: 'Person id is required'});
    if( !year )
        return response.status(400).json({message: 'School year id is required'});

    try {
        const res = await pool.query('SELECT (SELECT COUNT(*) FROM staff_assignments WHERE person_id = $1 AND school_year_id = $2) + \
                    (SELECT count(*) FROM instructor_assignments WHERE instructor_id = $1 AND school_year_id = $2) AS status;', [user, year]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const registrationRouter = express.Router();
registrationRouter.get('/student/info', getStudentRegistrationData);
registrationRouter.get('/elective/available', getElectiveAvailability);
registrationRouter.get('/grades/', getGrades);
registrationRouter.get('/staff/status', getStaffStatus);

module.exports = registrationRouter;