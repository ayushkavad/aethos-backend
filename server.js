const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaugthException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGTH EXCEPTION Shutting down...');
  process.exit(1);
});


dotenv.config({ path: './config.env' });

const app = require('./app');


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


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});


process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGTH REJECTION Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
