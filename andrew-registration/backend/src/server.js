const express = require('express');
const app = express();
const morgan = require('morgan');

const directoriesRouter = require('./routes/directories');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const registrationRouter = require('./routes/registration');

app.use(morgan('dev'));

app.use('/directories', directoriesRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/registration', registrationRouter);

app.listen(3001, () => {
    console.log(`App running on port 3001.`)
});