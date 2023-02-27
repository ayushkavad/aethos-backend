const express = require('express');
const courseController = require('./controllers/courseController');
const Course = require('./model/courseModel');
const app = express();

// body parser
app.use(express.json());

app.get('/api/v1/courses', courseController.getAllCourses);
app.post('/api/v1/course', courseController.createCourse);
app.get('/api/v1/courses/:id', courseController.getCourse);
app.patch('/api/v1/course/:id', courseController.updateCourse);
app.delete('/api/v1/course/:id', courseController.deleteCourse);

module.exports = app;
