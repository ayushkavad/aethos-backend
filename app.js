const express = require('express');
const Course = require('./model/courseModel');
const app = express();

// Body Parser
app.use(express.json());

app.get('/api/v1/courses', async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      status: 'success',
      courses: courses.length,
      data: {
        data: courses,
      },
    });
  } catch (err) {
    req.status(400).json({
      status: 'fail',
      message: err,
    });
  }
});

app.get('/api/v1/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        data: course,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No course found with that ID!',
    });
  }
});

app.post('/api/v1/course', async (req, res, next) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent!',
    });
  }
});

app.patch('/api/v1/course/:id', async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: course,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No course found with that ID!',
    });
  }
});

app.delete('/api/v1/course/:id', async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'No course found with that ID!',
    });
  }
});

module.exports = app;
