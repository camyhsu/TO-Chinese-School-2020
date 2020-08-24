users = [
    {
        user_id: 123,
        username: 'user1',
        english_first_name: 'andrew',
        english_last_name: 'tsui',
        chinese_name: 'chinese',
        gender: 'M',
        birth_month: '6',
        birth_year: '1999',
        native_langugage: 'English'
    },
    {
        user_id: 456,
        address_id: 456,
        username: 'user2',
        english_first_name: 'andrew',
        english_last_name: 'tsui',
        chinese_name: 'chinese',
        gender: 'M',
        birth_month: '6',
        birth_year: '1999',
        native_langugage: 'English'
    },
    {
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
    }
]

addresses = [
    {
        address_id: 456,
        street: 'Street St',
        city: 'Thousand Oaks',
        state: 'CA',
        zipcode: 91362,
        home_phone: 1234567890,
        cell_phone: 9876543210,
        email: 'email@email.com'
    },
    {
        address_id: 345,
        family_id: 345,
        street: 'Street St',
        city: 'Thousand Oaks',
        state: 'CA',
        zipcode: 91362,
        home_phone: 1234567890,
        cell_phone: 9876543210,
        email: 'email@email.com'
    }
]

families = [
    {
        family_id: 345,
        parent_one_id: 789,
        parent_two_id: 2345,
    },
    {
        family_id: 678,
        parent_one_id: 456,
        parent_two_id: 2345,
    }
]

const getUserData = async (request, response, next) => {
    const id = request.query.id;
    
    if( !id )
        return response.status(400).json({message: 'Id is required'});

    try {
        var user = users.find(({user_id}) => user_id === id)
        if (!user)
            return response.status(404).json({message: `No user found with id: ${id}`});
        return response.status(200).json(user);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getUserAddress = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Id is required'});

    try {
        var user = users.find(({user_id}) => user_id === id)
        if (!user)
            return response.status(404).json({message: `No address found for person id: ${id}`});
        var address = addresses.find(({address_id}) => address_id === user.address_id)
        if (!address)
            return response.status(404).json({message: `No address found for person id: ${id}`});
        return response.status(200).json(address);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getFamilyAddress = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Id is required'});

    try {
        var user = users.find(({user_id}) => user_id === id)
        if (!user)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        var family = families.find(({parent_one_id, parent_two_id}) => parent_one_id === user.user_id || parent_two_id === user.user_id);
        if (!family)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        var address = addresses.find(({family_id}) => family_id === family.family_id)
        if (!address)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        return response.status(200).json(address);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUserData,
    getUserAddress,
    getFamilyAddress,
};