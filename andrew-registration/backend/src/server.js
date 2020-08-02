
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const db = require('./queries');

app.get('/', (request, response) => {
    response.json({info: 'Node.js, Express, and Postgres API'})
});

app.get('/people/email/:email', db.getPeopleByEmail);
app.get('/people/chineseName/:chineseName', db.getPeopleByChineseName);
app.get('/people/englishName/:first_last', db.getPeopleByEnglishName);
app.get('/signin/username/:username/password/:password', db.verifyUserSignIn);
app.get('/userdata/:person_id', db.getUserData);
app.get('/parentdata/:person_id', db.getParentData);
app.get('/studentdata/:person_id', db.getStudentData);
app.patch('/userdata/edit/:person_id', db.patchUserData);

app.listen(3001, () => {
    console.log(`App running on port 3001.`)
});