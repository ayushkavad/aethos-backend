const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./../model/courseModel');
const User = require('../model/userModel');
const Review = require('../model/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connect successfully...');
  });

const course = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const review = JSON.parse(fs.readFileSync(`${__dirname}/review.json`, 'utf-8'));

const importData = async () => {
  try {
    // await Course.create(course);
    await Review.create(review);
    // await User.create(users, { validateBeforeSave: false });

    console.log('Data lodded successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await Course.deleteMany();
    await Review.deleteMany();
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
