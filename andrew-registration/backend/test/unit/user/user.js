users = [
    {
        user_id: 123,
        username: 'user1',
        english_first_name: 'andrew',
        english_last_name: 'tsui',
        chinese_name: 'chinese',
        gender: 'M',
        birth_month: '2',
        birth_year: '1996',
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
        family_id: 900,
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
    },
    {
        family_id: 678,
        parent_one_id: 456,
    },
    {
        family_id :654,
        parent_one_id: 404
    }
]

families_children = [
    {
        family_id: 345,
        child_id: 123
    },
    {
        family_id: 654,
        child_id: 789
    }
]

const getUserData = async (request, response, next) => {
    const id = request.query.id;
    
    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        var user = users.find(({user_id}) => user_id === id)
        if (!user)
            return response.status(404).json({message: `No user found with person id: ${id}`});
        return response.status(200).json(user);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getUserAddress = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});

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
        return response.status(400).json({message: 'Person id is required'});

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

const getStudentData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        var family = families.find(({family_id}) => family_id === id);
        if (!family)
            return response.status(404).json({message: `No students found for family id: ${id}`});
        var children = families_children.find(({family_id}) => family_id === family.family_id)
        if (!children)
            return response.status(404).json({message: `No students found for family id: ${id}`});
        var student = users.find(({user_id}) => user_id === children.child_id)
        if (!student)
            return response.status(404).json({message: `No students found for family id: ${id}`});
        return response.status(200).json(student);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getParentData = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});

    try {
        var family = families.find(({family_id}) => family_id === id);
        if (!family)
            return response.status(404).json({message: `No parents found for family id: ${id}`});
        var parents = users.find(({user_id}) => user_id === family.parent_one_id || user_id === family.parent_two_id);
        if (!parents)
            return response.status(404).json({message: `No parents found for family id: ${id}`});
        return response.status(200).json(parents);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const getFamilyAddressFromChild = async (request, response, next) => {
    const id = request.query.id;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});

    try {
        var family = families_children.find(({child_id}) => child_id === id);
        if (!family)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        var address = addresses.find(({family_id}) => family_id === family.family_id);
        if (!address)
            return response.status(404).json({message: `No family address found for person id: ${id}`});
        return response.status(200).json(address);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

const makeChanges = (original, update) => {
    for(key in update) {
        if(update[key])
            original[key] = update[key];
    }
    return original;
}

const patchUserData = async (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    if( !id )
        return response.status(400).json({message: 'Person id is required'});
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});

    try {
        var user = users.find(({user_id}) => user_id === id);
        if (!user)
            return response.status(404).json({message: `No user found with person id: ${id}`});
        var userIndex = users.indexOf(user);
        var changedUser = makeChanges(user, body);
        users.splice(userIndex, userIndex, changedUser);
        var updatedUser = users.find(({user_id}) => user_id === id);
        response.status(200);
    }
    catch (error) {
        throw error;
    }
}

const patchAddress = async (request, response, next) => {
    const id = request.params.id;
    const body = request.body;

    if( !id )
        return response.status(400).json({message: 'Address id is required'});
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});

    try {
        var address = addresses.find(({address_id}) => address_id === id);
        if (!address)
            return response.status(404).json({message: `No address found with address id: ${id}`});
        var addressIndex = addresses.indexOf(address);
        var changedAddress = makeChanges(address, body);
        addresses.splice(addressIndex, addressIndex, changedAddress);
        var updatedAddress = addresses.find(({address_id}) => address_id === id);
        response.status(200);
    }
    catch (error) {
        throw error;
    }
}

const addChild = async (request, response, next) => {
    const body = request.body;
    const id = request.params.id;

    if( !id )
        return response.status(400).json({message: 'Family id is required'});
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});

    try {
        var family = families.find(({family_id}) => family_id === id)
        if( !family )
            return response.status(404).json({message: `No family found with family id: ${id}`})
        var child = users.find(({english_first_name, english_last_name, birth_month, birth_year, gender}) => 
            english_first_name === body.english_first_name && english_last_name === body.english_last_name && 
            birth_month === body.birth_month && birth_year === body.birth_year && gender === body.gender)
        
        var newFamiliesChildren = {family_id : id, child_id: child.user_id};
        families_children.splice(0,0, newFamiliesChildren);
        var newlyAdded = families_children.find(({family_id, child_id}) => family_id === id && child_id === child.user_id);
        response.status(201);
    }
    catch (error) {
        throw error;
    }
}

const addAddress = async (request, response, next) => {
    const id = request.params.id;
    const body = request.body;
    
    if( !id )
        return response.status(400).json({message: 'Person id is required'});
    if( !body || Object.keys(body).length === 0 )
        return response.status(400).json({message: 'JSON body required'});

    try {
        var address = addresses.find(({street, city, state, zipcode, home_phone, email}) => 
            street === body.street && city === body.city && state === body.state && 
            zipcode === body.zipcode && home_phone === body.home_phone && email === body.email);
        var user = users.find(({user_id}) => user_id === id);
        if( !user )
            return response.status(404).json({message: `No person found with user id: ${id}`})
        var userIndex = users.indexOf(user);
        user.address_id = address.address_id;
        users.splice(userIndex, userIndex, user);
        response.status(201);
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    getUserData,
    getUserAddress,
    getFamilyAddress,
    getStudentData,
    getParentData,
    getFamilyAddressFromChild,
    patchUserData,
    patchAddress,
    addChild,
    addAddress
};