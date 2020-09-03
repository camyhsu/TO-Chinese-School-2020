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

module.exports = {
    getPeople,
    getGrades
}