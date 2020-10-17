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
        const res = await pool.query('SELECT people.id, english_first_name, english_last_name, chinese_name, birth_month, birth_year, prev_grade_id FROM people \
                    FULL JOIN (SELECT people.id, MAX(grade_id) as prev_grade_id FROM people FULL JOIN student_class_assignments AS sca ON people.id = sca.student_id \
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

const getBooks = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'School year id is required'});
    try {
        const res = await pool.query('SELECT id, grade_id, book_charge_in_cents FROM book_charges WHERE school_year_id = $1;', [id]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStaffStatus = async (request, response, next) => {
    const parentOne = request.query.parentOne;
    const parentTwo = request.query.parentTwo;
    const year = request.query.year;

    if( !parentOne )
        return response.status(400).json({message: 'Parent One id is required'});
    if( !year )
        return response.status(400).json({message: 'School year id is required'});

    try {
        const res = await pool.query('SELECT (SELECT COUNT(*) FROM instructor_assignments WHERE (instructor_id = $1 OR instructor_id = $2) AND school_year_id = $3 \
                    AND (role = \'Primary Instructor\' OR role = \'Secondary Instructor\')) AS instructor_discount, (SELECT COUNT(*) FROM staff_assignments \
                    WHERE (person_id = $1 OR person_id = $2) AND school_year_id = $3) AS staff_discount;', [parentOne, parentTwo, year]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getNumStudentsRegistered = async (request, response, next) => {
    const user = request.query.user;
    const year = request.query.year;

    if( !user )
        return response.status(400).json({message: 'Person id is required'});
    if( !year )
        return response.status(400).json({message: 'School year id is required'});

    try {
        const res = await pool.query('SELECT COUNT(*) AS registered, COUNT(CASE WHEN staff_discount THEN 1 END) as staff_count, \
                    COUNT(CASE WHEN instructor_discount THEN 1 END) as instructor_count FROM student_fee_payments WHERE registration_payment_id IN \
                    (SELECT id FROM registration_payments WHERE paid_by_id = $1 AND school_year_id = $2 AND paid = true);', [user, year]);
        return response.status(200).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const addStudentPreference = async (request, response, next) => {
    const body = await readBody(request);
    const { school_year_id, student_id, entered_by_id, previous_grade_id, grade_id, school_class_type, elective_id } = JSON.parse(body);

    try {
        const res = await pool.query('INSERT INTO registration_preferences (school_year_id, student_id, entered_by_id, previous_grade_id, grade_id, school_class_type, \
                    elective_class_id) VALUES ($1, $2, $3, $4, $5, $6, $7);', [school_year_id, student_id, entered_by_id, previous_grade_id, grade_id, school_class_type, elective_id]);
        return response.status(201).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const addRegistrationPayment = async (request, response, next) => {
    const body = await readBody(request);
    const { school_year_id, paid_by_id, pva_due_in_cents, ccca_due_in_cents, grand_total_in_cents, paid, request_in_person } = JSON.parse(body);

    try {
        const res = await pool.query('INSERT INTO registration_payments (school_year_id, paid_by_id, pva_due_in_cents, ccca_due_in_cents, grand_total_in_cents, paid, \
                    request_in_person) VALUES ($1, $2, $3, $4, $5, $6, $7);', [school_year_id, paid_by_id, pva_due_in_cents, ccca_due_in_cents, grand_total_in_cents, paid, request_in_person]);
        return response.status(201).json(res.rows);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const registrationRouter = express.Router();
registrationRouter.get('/student/info', getStudentRegistrationData);
registrationRouter.get('/elective/available', getElectiveAvailability);
registrationRouter.get('/grades', getGrades);
registrationRouter.get('/books', getBooks);
registrationRouter.get('/staff/status', getStaffStatus);
registrationRouter.get('/registered/count', getNumStudentsRegistered);
registrationRouter.post('/preference/add', addStudentPreference);
registrationRouter.post('/payment/add', addRegistrationPayment);

module.exports = registrationRouter;