users = [
    {
        user_id: 123,
        english_first_name: 'Andrew',
        english_last_name: 'Last',
        chinese_name: 'chinese',
        email: 'email.com',
        home_phone: '1234567890',
        gender: 'M'
    }
]

grades = [
    {
        chinese_name: 'chinese 1',
        english_name: 'grade 1',
        short_name: 'g1'
    },
    {
        chinese_name: 'chinse 2',
        english_name: 'grade 2',
        short_name: 'g2'
    }
]

sca = [
    {
        student_id: 1,
        class_id: 1,
        year_id: 1,
        grade_id: 1,
        elective_id: 1
    },
    {
        student_id: 2,
        class_id: 1,
        year_id: 1,
        grade_id: 1,
        elective_id: 2
    },
    {
        student_id: 3,
        class_id: 2,
        year_id: 1,
        grade_id: 2,
        elective_id: 2
    },
    {
        student_id: 4,
        class_id: 2,
        year_id: 2,
        grade_id: 2,
        elective_id: 1
    }
]

sc = [
    {
        english_name: 'chinese class 1',
        chinese_name: 'chinese chinese 1',
        location: 'C1',
        i_english_name: 'chinese 1 instructor',
        i_chinese_name: 'chinese chinese 1 instructor',
        active: 't',
        year_id: 1,
        class_id: 1
    },
    {
        english_name: 'chinese class 2',
        chinese_name: 'chinese chinese 2',
        location: 'C2',
        i_english_name: 'chinese 2 instructor',
        i_chinese_name: 'chinese chinese 2 instructor',
        active: 'f',
        year_id: 1,
        class_id: 2
    },
    {
        english_name: 'chinese class 3',
        chinese_name: 'chinese chinese 3',
        location: 'C3',
        i_english_name: 'chinese 3 instructor',
        i_chinese_name: 'chinese chinese 3 instructor',
        active: 'f',
        year_id: 1,
        class_id: 3
    }
]

const getPeople = async (request, response, next) => {
    const qEmail = request.query.email;
    const chinese = request.query.chinese;
    const english = request.query.english;

    if( qEmail ) {
        try {
            const user = users.find(({email}) => email === qEmail);
            if( !user )
                return response.status(404).json({message: `No results found with email: ${qEmail}`});
            return response.status(200).json(user);
        }
        catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    else if ( chinese ) {
        try {
            const user = users.find(({chinese_name}) => chinese_name === chinese);
            if( !user )
                return response.status(404).json({message: `No results found with chinese name: ${chinese}`});
            return response.status(200).json(user);
        }
        catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    else if( english ) {
        const nameArr = english.split(' ');
        try {
            // if only one name is given, search for the name in first and last names
            if( nameArr.length == 1 ) {
                const name = nameArr[0];
                const user = users.find(({english_first_name, english_last_name}) => name === english_first_name || name === english_last_name);
                if( !user )
                    return response.status(404).json({message: `No results found with name: ${name}`});
                return response.status(200).json(user);
            }
            // take the first and last names in the query as the first and last name, respectively
            else {
                const firstName = nameArr[0];
                const lastName = nameArr[nameArr.length - 1];
                const user = users.find(({english_first_name, english_last_name}) => firstName === english_first_name || lastName === english_last_name);
                if( !user )
                    return response.status(404).json({message: `No results found with first name: ${firstName} and last name: ${lastName}`});
                return response.status(200).json(user);
            }
        }
        catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    else {
        return response.status(400).json({message: 'One field required: Email, Chinese Name, or English Name'});
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

const getStudentCountByGrade = async (request, response, next) => {
    const schoolYearId = request.query.id;
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var studentCount = sca.reduce((c, { grade_id, year_id }) => 
            year_id === schoolYearId ? (c[grade_id] = (c[grade_id] || 0) + 1, c) : (c[grade_id] = (c[grade_id] || 0), c),{});
        response.status(200).json(studentCount);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStudentCountByClass = async (request, response, next) => {
    const schoolYearId = request.query.id;
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var studentCount = sca.reduce((c, { class_id, year_id }) => 
            year_id === schoolYearId ? (c[class_id] = (c[class_id] || 0) + 1, c) : (c[class_id] = (c[class_id] || 0), c),{});
        response.status(200).json(studentCount);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStudentCountByElective = async (request, response, next) => {
    const schoolYearId = request.query.id; 
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var studentCount = sca.reduce((c, { elective_id, year_id }) => 
            year_id === schoolYearId ? (c[elective_id] = (c[elective_id] || 0) + 1, c) : (c[elective_id] = (c[elective_id] || 0), c),{});
        response.status(200).json(studentCount);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getActiveClasses = async (request, response, next) => {
    const schoolYearId = request.query.id;
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var activeClasses = sc.filter(({active, year_id}) => active === 't' && year_id === schoolYearId);
        if( !activeClasses || activeClasses.length === 0 ) 
            return response.status(404).json({message: `No active classes found for school year id: ${schoolYearId}`});
        return response.status(200).json(activeClasses);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getAllSchoolClasses = async (request, response, next) => {
    const schoolYearId = request.query.id; 
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var schoolClasses = sc.filter(({year_id}) => year_id === schoolYearId);
        if( !schoolClasses || schoolClasses.length === 0 ) 
            return response.status(404).json({message: `No school classes found for school year id: ${schoolYearId}`});
        response.status(200).json(schoolClasses);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getStudentInfoForClass = async (request, response, next) => {
    const classId = request.query.class; 
    if( !classId ) 
        return response.status(400).json({message: 'Class id required'});
    const schoolYearId = request.query.year;
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var studentInfo = sca.filter(({year_id, class_id}) => year_id === schoolYearId && class_id === classId)
        if( !studentInfo || studentInfo.length === 0 )
            return response.status(404).json({message: `No student info found for class id: ${classId} and school year id: ${schoolYearId}`})
        return response.status(200).json(studentInfo);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getClassInfoForClass = async (request, response, next) => {
    const classId = request.query.class; 
    if( !classId ) 
        return response.status(400).json({message: 'Class id required'});
    const schoolYearId = request.query.year;
    if( !schoolYearId ) 
        return response.status(400).json({message: 'School year id required'});
    
    try {
        var classInfo = sc.find(({year_id, class_id}) => year_id === schoolYearId && class_id === classId);
        if( !classInfo )
            return response.status(404).json({message: `No class info found for class id: ${classId} and school year id: ${schoolYearId}`});
        return response.status(200).json(classInfo);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}


module.exports = {
    getPeople,
    getGrades,
    getStudentCountByGrade,
    getStudentCountByClass,
    getStudentCountByElective,
    getActiveClasses,
    getAllSchoolClasses,
    getStudentInfoForClass,
    getClassInfoForClass
}