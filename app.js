/**
 * This code is an Express application that provides a RESTful API for a fictional educational platform.
 */
const express = require('express');
const courseRouter = require('./router/courseRoutes');
const userRouter = require('./router/userRoutes');
const reviewRouter = require('./router/reviewRouters');
const uploadRouter = require('./router/mediaRouters');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(helmet());


if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ['ratingsQuantity', 'ratingsAverage', 'level', 'price'],
  })
);

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the aethos!',
  });
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/uploads', uploadRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not found ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
