const express = require('express');
const courseRouter = require('./router/courseRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/courses', courseRouter);

module.exports = app;
