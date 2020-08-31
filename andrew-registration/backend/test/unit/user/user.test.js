const { getUserData, getUserAddress, getFamilyAddress, getStudentData, getParentData, getFamilyAddressFromChild, 
        patchUserData, patchAddress,addChild,addAddress } = require('./user');

const mockRequest = (params, query, body) => ({params, query, body});
  
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getUserData tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 404 and an empty response if the user does not exist', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No user found with person id: 404'
        });
    })
    it('should return 200 and return the user\'s data if user exists', async () => {
        const req = mockRequest({},{id: 123},{});
        const res = mockResponse();
        await getUserData(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            username: 'user1',
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '2',
            birth_year: '1996',
            native_langugage: 'English'
        });
    })
});

describe('getUserAddress tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 404 if the user does not exist', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No address found for person id: 404'
        });
    })
    it('should return 404 if the user exists but the address does not', async () => {
        const req = mockRequest({},{id: 789},{});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No address found for person id: 789'
        });
    })
    it('should return 200 and return the address data if user exists', async () => {
        const req = mockRequest({},{id: 456},{});
        const res = mockResponse();
        await getUserAddress(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            address_id: 456,
            family_id: 900,
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'
        });
    })
});

describe('getFamilyAddress tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 404 if the user does not exist', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 404'
        });
    })
    it('should return 404 if the user exists but the family does not', async () => {
        const req = mockRequest({},{id: 123},{});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 123'
        });
    })
    it('should return 404 if the user and family exists but the address does not', async () => {
        const req = mockRequest({},{id: 456},{});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 456'
        });
    })
    it('should return 200 and return the family address data if user exists', async () => {
        const req = mockRequest({},{id: 789},{});
        const res = mockResponse();
        await getFamilyAddress(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            address_id: 345,
            family_id: 345,
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'
        });
    })
});

describe('getStudentData tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getStudentData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Family id is required'
        });
    })
    it('should return 404 if the family does not exist', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getStudentData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No students found for family id: 404'
        });
    })
    it('should return 404 if the family exists but the student does not', async () => {
        const req = mockRequest({},{id: 678},{});
        const res = mockResponse();
        await getStudentData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No students found for family id: 678'
        });
    })
    it('should return 200 and return the family address data if user exists', async () => {
        const req = mockRequest({},{id: 345},{});
        const res = mockResponse();
        await getStudentData(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 123,
            username: 'user1',
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '2',
            birth_year: '1996',
            native_langugage: 'English'
        });
    })
});

describe('getParentData tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getParentData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Family id is required'
        });
    })
    it('should return 404 if the family does not exist', async () => {
        const req = mockRequest({},{id: 404},{});
        const res = mockResponse();
        await getParentData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No parents found for family id: 404'
        });
    })
    it('should return 404 if the family exists but the parent does not', async () => {
        const req = mockRequest({},{id: 654},{});
        const res = mockResponse();
        await getParentData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No parents found for family id: 654'
        });
    })
    it('should return 200 and return the family address data if user exists', async () => {
        const req = mockRequest({},{id: 345},{});
        const res = mockResponse();
        await getParentData(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user_id: 789,
            address_id: 457,
            username: 'user3',
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '6',
            birth_year: '1999',
            native_langugage: 'English'
        });
    })
});

describe('getFamilyAddressFromChildData tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{});
        const res = mockResponse();
        await getFamilyAddressFromChild(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 404 if the family does not exist', async () => {
        const req = mockRequest({},{id: 456},{});
        const res = mockResponse();
        await getFamilyAddressFromChild(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 456'
        });
    })
    it('should return 404 if the family exists but the address does not', async () => {
        const req = mockRequest({},{id: 789},{});
        const res = mockResponse();
        await getFamilyAddressFromChild(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family address found for person id: 789'
        });
    })
    it('should return 200 and return the family address data if user exists', async () => {
        const req = mockRequest({},{id: 123},{});
        const res = mockResponse();
        await getFamilyAddressFromChild(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            address_id: 345,
            family_id: 345,
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'
        });
    })
});

describe('patchUserData tests', () => {
    it('should return 400 if id is missing in params', async () => {
        const req = mockRequest({},{},{
            english_first_name: 'emily',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'F',
            birth_month: '2',
            birth_year: '1996',
            native_langugage: 'English'});
        const res = mockResponse();
        await patchUserData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 400 if body is missing', async () => {
        const req = mockRequest({id: 123},{},{});
        const res = mockResponse();
        await patchUserData(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'JSON body required'
        });
    })
    it('should return 404 if the user does not exist', async () => {
        const req = mockRequest({id: 404},{},{
            english_first_name: 'emily',
            english_last_name: 'tsui',
            gender: 'F',
            birth_month: '2',
            native_langugage: 'Mandarin'});
        const res = mockResponse();
        await patchUserData(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No user found with person id: 404'
        });
    })
    it('should return 200 and return the updated user data if user exists', async () => {
        const req = mockRequest({id: 123},{},{
            english_first_name: 'emily',
            english_last_name: 'tsui',
            gender: 'F',
            birth_month: '2',
            native_langugage: 'Mandarin'});
        const res = mockResponse();
        await patchUserData(req, res);
        expect(res.status).toBeCalledWith(200);
    })
});

describe('patchAddress tests', () => {
    it('should return 400 if id is missing in params', async () => {
        const req = mockRequest({},{},{
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'});
        const res = mockResponse();
        await patchAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Address id is required'
        });
    })
    it('should return 400 if body is missing', async () => {
        const req = mockRequest({id: 345},{},{});
        const res = mockResponse();
        await patchAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'JSON body required'
        });
    })
    it('should return 404 if the address does not exist', async () => {
        const req = mockRequest({id: 404},{},{
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'});
        const res = mockResponse();
        await patchAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No address found with address id: 404'
        });
    })
    it('should return 200 and return the updated address data if address exists', async () => {
        const req = mockRequest({id: 345},{},{
            street: 'Avenue Ave',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91360,
            home_phone: 1234567890,
            cell_phone: 987656789,
            email: 'email123@email.com'});
        const res = mockResponse();
        await patchAddress(req, res);
        expect(res.status).toBeCalledWith(200);
    })
});

describe('addChild tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '6',
            birth_year: '1999',
            native_langugage: 'English'});
        const res = mockResponse();
        await addChild(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Family id is required'
        });
    })
    it('should return 400 if body is missing in query', async () => {
        const req = mockRequest({id: 345},{},{});
        const res = mockResponse();
        await addChild(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'JSON body required'
        });
    })
    it('should return 404 if the address does not exist', async () => {
        const req = mockRequest({id: 404},{},{
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '6',
            birth_year: '1999',
            native_langugage: 'English'});
        const res = mockResponse();
        await addChild(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No family found with family id: 404'
        });
    })
    it('should return 200 and return the newly added data if family exists', async () => {
        const req = mockRequest({id: 345},{},{
            english_first_name: 'andrew',
            english_last_name: 'tsui',
            chinese_name: 'chinese',
            gender: 'M',
            birth_month: '6',
            birth_year: '1999',
            native_langugage: 'English'});
        const res = mockResponse();
        await addChild(req, res);
        expect(res.status).toBeCalledWith(201);
    })
});

describe('addAddress tests', () => {
    it('should return 400 if id is missing in query', async () => {
        const req = mockRequest({},{},{
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'});
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Person id is required'
        });
    })
    it('should return 400 if body is missing in query', async () => {
        const req = mockRequest({id: 123},{},{});
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'JSON body required'
        });
    })
    it('should return 404 if the person does not exist', async () => {
        const req = mockRequest({id: 404},{},{
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'});
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No person found with user id: 404'
        });
    })
    it('should return 200 and return the newly added data if person exists', async () => {
        const req = mockRequest({id: 123},{},{
            street: 'Street St',
            city: 'Thousand Oaks',
            state: 'CA',
            zipcode: 91362,
            home_phone: 1234567890,
            cell_phone: 9876543210,
            email: 'email@email.com'});
        const res = mockResponse();
        await addAddress(req, res);
        expect(res.status).toBeCalledWith(201);
    })
});