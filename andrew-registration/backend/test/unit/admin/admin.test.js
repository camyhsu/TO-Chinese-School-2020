const { verifyUserSignIn, changePassword } = require('./admin');

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
