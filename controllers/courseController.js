exports.getAllCourses = async (req, res, next) => {
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
};

exports.getCourse = async (req, res, next) => {
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
};

exports.createCourse = async (req, res, next) => {
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
};

exports.updateCourse = async (req, res, next) => {
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
};

exports.deleteCourse = async (req, res, next) => {
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
};
