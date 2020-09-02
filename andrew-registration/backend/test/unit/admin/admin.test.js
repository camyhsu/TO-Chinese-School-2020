const { verifyUserSignIn, changePassword, addPerson, addAddress, changeClassActiveStatus } = require('./admin');

const mockRequest = (params, query, body) => ({params, query, body});
  
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('verifyUserSignIn tests', () => {
    it('should return 400 if username is not in query', async () => {
        const req = mockRequest({},{password: 'password'},{});
        const res = mockResponse();
        await verifyUserSignIn(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Username is required'
        });
    })
    it('should return 400 if password is not in query', async () => {
        const req = mockRequest({},{username: 'username'},{});
        const res = mockResponse();
        await verifyUserSignIn(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password is required'
        });
    })
    it('should return 404 if username does not exist', async () => {
        const req = mockRequest({},{username: '404', password: 'password'},{});
        const res = mockResponse();
        await verifyUserSignIn(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No user found with username: 404'
        });
    })
    it('should return 401 if password doesn\'t match for the username', async () => {
        const req = mockRequest({},{username: 'username', password: 'wrong'},{});
        const res = mockResponse();
        await verifyUserSignIn(req, res);
        expect(res.status).toBeCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Sign in failed'
        });
    })
    it('should return 200 if username and password match', async () => {
        const req = mockRequest({},{username: 'username', password: 'testtest'},{});
        const res = mockResponse();
        await verifyUserSignIn(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(123);
    })
})

describe('changePassword tests', () => {
    it('should return 400 if username is not in params', async () => {
        const req = mockRequest({},{},{password: 'password'});
        const res = mockResponse();
        await changePassword(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Username is required'
        });
    })
    it('should return 400 if password is not in query', async () => {
        const req = mockRequest({username: 'username'},{},{});
        const res = mockResponse();
        await changePassword(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password is required'
        });
    })
    it('should return 200 if password is successfully changed', async () => {
        const req = mockRequest({username: 'username'},{},{password: 'testtest'});
        const res = mockResponse();
        await changePassword(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    })
})

describe('addPerson tests', () => {
    it('should return 400 if there is no body', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await addPerson(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Body is required'
        });
    })
    it('should return 201 if person is successfully created', async () => {
        const req = mockRequest({},{},{
            english_first_name: 'newperson',
            english_last_name: 'last',
            gender: 'M'
        });
        const res = mockResponse();
        await addPerson(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toHaveBeenCalledWith([]);
    })
})

describe('addAddress tests', () => {
    it('should return 400 if there is no body', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Body is required'
        });
    })
    it('should return 201 if address is successfully created', async () => {
        const req = mockRequest({},{},{
            street: 'Avenue',
            city: 'City',
            state: 'CA',
            zipcode: '12345',
            home_phone: '9876543210',
            email: 'email'
        });
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toHaveBeenCalledWith([]);
    })
})

describe('changeClassActiveStatus tests', () => {
    it('should return 400 if school year id is missing from params', async () => {
        const req = mockRequest({class_id: 123},{},{active: 't'});
        const res = mockResponse();
        await changeClassActiveStatus(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'School year id is required'
        });
    })
    it('should return 400 if class id is missing from params', async () => {
        const req = mockRequest({year_id: 10},{},{active: 't'});
        const res = mockResponse();
        await changeClassActiveStatus(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Class id is required'
        });
    })
    it('should return 400 if body is missin', async () => {
        const req = mockRequest({class_id: 123, year_id: 10},{},{});
        const res = mockResponse();
        await changeClassActiveStatus(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Body is required'
        });
    })
    it('should return 404 if class does not exist', async () => {
        const req = mockRequest({class_id: 404, year_id: 10},{},{active: 't'});
        const res = mockResponse();
        await changeClassActiveStatus(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Class not found with class id: 404 and year id: 10'
        });
    })
    it('should return 200 if address is successfully created', async () => {
        const req = mockRequest({class_id: 1, year_id: 10},{},{active: 'f'});
        const res = mockResponse();
        await changeClassActiveStatus(req, res);
        expect(res.status).toBeCalledWith(200);
    })
})
