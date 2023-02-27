const fs = require('fs');
const mongoose = require('mongoose');
const Course = require('./../model/courseModel');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);

// Database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connect successfully...');
  });

const course = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Course.create(course);
    console.log('Data lodded successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data deleted successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
