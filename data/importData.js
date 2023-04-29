const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./../model/courseModel');
const Review = require('../model/reviewModel');
const User = require('../model/userModel');

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

const courses = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/review.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Course.create(courses);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });

    console.log('Data lodded successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Course.deleteMany();
    await Review.deleteMany();
    // await User.deleteMany(users);
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
