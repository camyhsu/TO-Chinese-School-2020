const { getPeople, getGrades } = require('./directories');

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