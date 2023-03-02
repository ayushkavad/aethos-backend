const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorHandlerController');

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can not found ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
