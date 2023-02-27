// app.get('/api/v1/courses', async (req, res, next) => {
//     try {
//       const courses = await Course.find();
//       res.status(200).json({
//         status: 'success',
//         courses: courses.length,
//         data: {
//           data: courses,
//         },
//       });
//     } catch (err) {
//       req.status(400).json({
//         status: 'fail',
//         message: err,
//       });
//     }
//   });
