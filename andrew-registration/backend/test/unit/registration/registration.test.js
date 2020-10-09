const { getStudentRegistrationData, getElectiveAvailability, getGrades, } = require('./registration');

const mockRequest = (params, query, body) => ({params, query, body});

const mockResponse = () => {
const res = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
return res;
};

describe('getStudentRegistrationData tests', () => {
    it('should return 400 if school year id not in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getStudentRegistrationData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Family id is required'
        });
    })
    it('should return 200 if user found with email', async () => {
        const req = mockRequest({},{id: 14},{});
        const res = mockResponse();
        await getStudentRegistrationData(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {id: 1, english_name: 'andrew', chinese_name: 'chinese', birth_month: 6, birth_year: 1999, prev_grade: 5},
            {id: 2, english_name: 'andrew', chinese_name: 'chinese', birth_month: 4, birth_year: 2012, prev_grade: 4},
            {id: 3, english_name: 'andy', chinese_name: 'chinese', birth_month: 8, birth_year: 2006, prev_grade: 7}
        ]);
    })
})

describe('getElectiveAvailability tests', () => {
    it('should return 400 if school year id not in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getElectiveAvailability(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id is required'
        });
    })
    it('should return 200 if user found with email', async () => {
        const req = mockRequest({},{id: 14},{});
        const res = mockResponse();
        await getElectiveAvailability(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {id: 1, english_name: 'elective1', chinese_name: 'electivec1', max_size: 25, curr_size: 24},
            {id: 3, english_name: 'elective3', chinese_name: 'electivec3', max_size: 25, curr_size: 12}
        ]);
    })
})

describe('getGrades tests', () => {
    it('should return 200 when getting the grades', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getGrades(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {id: 1, chinese_name: 'chinese 1', english_name: 'grade 1', next_grade: 2},
            {id: 2, chinese_name: 'chinse 2', english_name: 'grade 2', next_grade: 3}
        ]);
    })
})