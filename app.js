const express = require('express');
const morgan = require('morgan');

const courseRouter = require('./router/courseRoutes');
const userRouter = require('./router/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middelware.');
  next();
});

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
