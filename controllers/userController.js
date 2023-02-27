exports.getAllUsers = async (req, res, next) => {
  try {
    // res.status(200).json({
    //   status: 'success',
    //   courses: courses.length,
    //   data: {
    //     data: courses,
    //   },
    // });
  } catch (err) {
    // req.status(400).json({
    //   status: 'fail',
    //   message: err,
    // });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     data: course,
    //   },
    // });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: 'No course found with that ID!',
    // });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // res.status(201).json({
    //   status: 'success',
    //   data: {
    //     data: newCourse,
    //   },
    // });
  } catch (err) {
    // res.status(400).json({
    //   status: 'fail',
    //   message: 'invalid data sent!',
    // });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     data: course,
    //   },
    // });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: 'No course found with that ID!',
    // });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // res.status(204).json({
    //   status: 'success',
    //   data: {
    //     data: null,
    //   },
    // });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: 'No course found with that ID!',
    // });
  }
};
