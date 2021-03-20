/* eslint-disable no-unused-vars */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './api/routes/index.js';

// Port to listen for requests
const PORT = process.env.PORT || 3001;
const corsOptions = { origin: 'http://localhost:3000' };

const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const app = express();

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => res.json({ message: 'Welcome to Thousand Oaks Chinese School.' }));

// Routes
routes.authRoutes(app);
routes.userRoutes(app);

app.get('*', wrapAsync(async (req, _res) => {
  await new Promise((resolve) => setTimeout(() => resolve(), 50));
  throw new Error(`Error${req.originalUrl}`);
}));

// Common response header
app.use((_req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );
  next();
});

app.use((error, _req, res, _next) => {
  console.log(error);
  res.status(error.status || 500).send({ message: error.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
