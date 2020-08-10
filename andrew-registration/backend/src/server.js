const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const directoriesRouter = require('./routes/directories');
const personRouter = require('./routes/person');
const adminRouter = require('./routes/admin');

app.use('/directories', directoriesRouter);
app.use('/person', personRouter);
app.use('/admin', adminRouter);

app.listen(3001, () => {
    console.log(`App running on port 3001.`)
});