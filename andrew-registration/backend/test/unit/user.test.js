const chai = require('chai')
const { getUserData, getUserAddress, getFamilyAddress } = require('./user');

const mockRequest = (query) => ({
    query
  });
  
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('canary tests', () => {
    it('should return true', () => {
        expect(true).toEqual(true);
    })
})

describe('getUserData tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Id is required'
        });
    })
    it('should return 200 and return the user\'s data if user exists', async () => {
        const req = mockRequest({id: 123});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    })
    it('should return 404 and an empty response if the user does not exist', async () => {
        const req = mockRequest({id: 404});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No user found with id: 404'
        });
    })
});

describe('getUserAddress tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Id is required'
        });
    })
    it('should return 404 if the user does not exist', async () => {
        const req = mockRequest({id: 404});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No address found for person id: 404'
        });
    })
    it('should return 404 if the user exists but the address does not', async () => {
        const req = mockRequest({id: 789});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No address found for person id: 789'
        });
    })
    it('should return 200 and return the address data if user exists', async () => {
        const req = mockRequest({id: 456});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    })
});

describe('getFamilyAddress tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Id is required'
        });
    })
    it('should return 404 if the user does not exist', async () => {
        const req = mockRequest({id: 404});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 404'
        });
    })
    it('should return 404 if the user exists but the family does not', async () => {
        const req = mockRequest({id: 123});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 123'
        });
    })
    it('should return 404 if the user and family exists but the address does not', async () => {
        const req = mockRequest({id: 456});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 456'
        });
    })
    it('should return 200 and return the family address data if user exists', async () => {
        const req = mockRequest({id: 789});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    })
});