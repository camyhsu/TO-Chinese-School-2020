students = [
    {
        id: 1,
        english_name: 'andrew',
        chinese_name: 'chinese',
        birth_month: 6,
        birth_year: 1999,
    },
    {
        id: 2,
        english_name: 'andrew',
        chinese_name: 'chinese',
        birth_month: 4,
        birth_year: 2012,
    },
    {
        id: 3,
        english_name: 'andy',
        chinese_name: 'chinese',
        birth_month: 8,
        birth_year: 2006,
    }
]

sca = [
    {
        student_id: 1,
        grade_id: 5
    },
    {
        student_id: 2,
        grade_id: 4
    },
    {
        student_id: 3,
        grade_id: 7
    }
]

electives = [
    {
        id: 1,
        english_name: 'elective1',
        chinese_name: 'electivec1',
        max_size: 25,
        curr_size: 24
    },
    {
        id: 2,
        english_name: 'elective2',
        chinese_name: 'electivec2',
        max_size: 25,
        curr_size: 25
    },
    {
        id: 3,
        english_name: 'elective3',
        chinese_name: 'electivec3',
        max_size: 25,
        curr_size: 12
    }
]

grades = [
    {
        id: 1,
        chinese_name: 'chinese 1',
        english_name: 'grade 1',
        next_grade: 2
    },
    {
        id: 2,
        chinese_name: 'chinse 2',
        english_name: 'grade 2',
        next_grade: 3
    }
]

const getStudentRegistrationData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        var studentsGrade = students;
        studentsGrade.forEach(function(student) {
            student.prev_grade = sca.find(e => e.student_id === student.id).grade_id;
        })
        return response.status(200).json(studentsGrade);
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
        const availableElectives = electives.filter(elective => elective.curr_size < elective.max_size);
        return response.status(200).json(availableElectives);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getGrades = async (request, response, next) => {
    try {
        const schoolGrades = grades;
        return response.status(200).json(schoolGrades);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

module.exports = {
    getStudentRegistrationData,
    getElectiveAvailability,
    getGrades,
}