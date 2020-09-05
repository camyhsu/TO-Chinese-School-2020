const { getPeople, getGrades, getStudentCountByGrade, getStudentCountByClass, getStudentCountByElective, 
        getActiveClasses, getAllSchoolClasses, getStudentInfoForClass, getClassInfoForClass, getActiveStudents } = require('./directories');

const mockRequest = (params, query, body) => ({params, query, body});
  
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getPeople tests', () => {
    it('should return 400 if no fields are given in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'One field required: Email, Chinese Name, or English Name'
        });
    })
    it('should return 404 if no user found with email', async () => {
        const req = mockRequest({},{email: 'email'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No results found with email: email'
        });
    })
    it('should return 200 if user found with email', async () => {
        const req = mockRequest({},{email: 'email.com'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            english_first_name: 'Andrew',
            english_last_name: 'Last',
            chinese_name: 'chinese',
            email: 'email.com',
            home_phone: '1234567890',
            gender: 'M'
        });
    })
    it('should return 404 if no user found with chinese name', async () => {
        const req = mockRequest({},{chinese: 'email'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No results found with chinese name: email'
        });
    })
    it('should return 200 if user found with chinese name', async () => {
        const req = mockRequest({},{chinese: 'chinese'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            english_first_name: 'Andrew',
            english_last_name: 'Last',
            chinese_name: 'chinese',
            email: 'email.com',
            home_phone: '1234567890',
            gender: 'M'
        });
    })
    it('should return 404 if no user found with english name', async () => {
        const req = mockRequest({},{english: 'Noname'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No results found with name: Noname'
        });
    })
    it('should return 404 if no user found with english first and last name', async () => {
        const req = mockRequest({},{english: 'Noname Guy'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No results found with first name: Noname and last name: Guy'
        });
    })
    it('should return 200 if user found with name', async () => {
        const req = mockRequest({},{english: 'Last'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            english_first_name: 'Andrew',
            english_last_name: 'Last',
            chinese_name: 'chinese',
            email: 'email.com',
            home_phone: '1234567890',
            gender: 'M'
        });
    })
    it('should return 200 if user found with english first and last name', async () => {
        const req = mockRequest({},{english: 'Andrew Last'},{});
        const res = mockResponse();
        await getPeople(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            english_first_name: 'Andrew',
            english_last_name: 'Last',
            chinese_name: 'chinese',
            email: 'email.com',
            home_phone: '1234567890',
            gender: 'M'
        });
    })
})

describe('getGrades tests', () => {
    it('should return 200 when getting the grades', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getGrades(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { chinese_name: 'chinese 1', english_name: 'grade 1',short_name: 'g1'},
            { chinese_name: 'chinse 2', english_name: 'grade 2', short_name: 'g2'}
        ]);
    })
})

describe('getStudentCountByGrade tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getStudentCountByGrade(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 200 when student count by grade', async () => {
        const req = mockRequest({},{id: 1},{});
        const res = mockResponse();
        await getStudentCountByGrade(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ '1': 2, '2': 1 });
    })
})

describe('getStudentCountByClass tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getStudentCountByClass(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 200 when student count by class', async () => {
        const req = mockRequest({},{id: 1},{});
        const res = mockResponse();
        await getStudentCountByClass(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ '1': 2, '2': 1 });
    })
})

describe('getStudentCountByElective tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getStudentCountByElective(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 200 when student count by class', async () => {
        const req = mockRequest({},{id: 1},{});
        const res = mockResponse();
        await getStudentCountByElective(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ '1': 1, '2': 2 });
    })
})

describe('getActiveClasses tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getActiveClasses(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 404 when no results found', async () => {
        const req = mockRequest({},{id: 3},{});
        const res = mockResponse();
        await getActiveClasses(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No active classes found for school year id: 3'
        });
    })
    it('should return 200 with list of active classes for school year', async () => {
        const req = mockRequest({},{id: 1},{});
        const res = mockResponse();
        await getActiveClasses(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{
            english_name: 'chinese class 1',
            chinese_name: 'chinese chinese 1',
            location: 'C1',
            i_english_name: 'chinese 1 instructor',
            i_chinese_name: 'chinese chinese 1 instructor',
            active: 't',
            year_id: 1,
            class_id: 1
        }]);
    })
})

describe('getAllSchoolClasses tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getAllSchoolClasses(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 404 when no results found', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getAllSchoolClasses(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No school classes found for school year id: 404'
        });
    })
    it('should return 200 with list of school classes for school year', async () => {
        const req = mockRequest({},{id: 1},{});
        const res = mockResponse();
        await getAllSchoolClasses(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
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
            }]);
    })
})

describe('getStudentInfoForClass tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{class: 1},{});
        const res = mockResponse();
        await getStudentInfoForClass(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 400 when class id is missing from query', async () => {
        const req = mockRequest({},{year: 1},{});
        const res = mockResponse();
        await getStudentInfoForClass(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Class id required'
        });
    })
    it('should return 404 when no results found', async () => {
        const req = mockRequest({},{class: 404, year: 404},{});
        const res = mockResponse();
        await getStudentInfoForClass(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No student info found for class id: 404 and school year id: 404'
        });
    })
    it('should return 200 with student info', async () => {
        const req = mockRequest({},{year: 1, class: 1},{});
        const res = mockResponse();
        await getStudentInfoForClass(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
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
            }]);
    })
})

describe('getClassInfoForClass tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{class: 1},{});
        const res = mockResponse();
        await getClassInfoForClass(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 400 when class id is missing from query', async () => {
        const req = mockRequest({},{year: 1},{});
        const res = mockResponse();
        await getClassInfoForClass(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Class id required'
        });
    })
    it('should return 404 when no results found', async () => {
        const req = mockRequest({},{class: 404, year: 404},{});
        const res = mockResponse();
        await getClassInfoForClass(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No class info found for class id: 404 and school year id: 404'
        });
    })
    it('should return 200 with class info', async () => {
        const req = mockRequest({},{year: 1, class: 1},{});
        const res = mockResponse();
        await getClassInfoForClass(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            english_name: 'chinese class 1',
            chinese_name: 'chinese chinese 1',
            location: 'C1',
            i_english_name: 'chinese 1 instructor',
            i_chinese_name: 'chinese chinese 1 instructor',
            active: 't',
            year_id: 1,
            class_id: 1
        });
    })
})

describe('getActiveStudents tests', () => {
    it('should return 400 when school year id is missing from query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getActiveStudents(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id required'
        });
    })
    it('should return 404 when no results found', async () => {
        const req = mockRequest({},{year: 404},{});
        const res = mockResponse();
        await getActiveStudents(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No active students found for school year id: 404'
        });
    })
    it('should return 200 with class info', async () => {
        const req = mockRequest({},{year: 1},{});
        const res = mockResponse();
        await getActiveStudents(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            [
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
              }
            ]
          ]);
    })
})