/**
 * This code sets up a web server using the Mongoose database.
 */

/**
 * Imports the Mongoose and dotenv modules.
 *
 * @param {string} mongoose The Mongoose module.
 * @param {string} dotenv The dotenv module.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

/**
 * Sets up a handler for unhandled exceptions.
 *
 * @param {Error} err The unhandled exception.
 */
process.on('uncaugthException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGTH EXCEPTION Shutting down...');
  process.exit(1);
});

/**
 * Loads the environment variables from the `.env` file.
 *
 * @param {string} path The path to the `.env` file.
 */
dotenv.config({ path: './config.env' });

/**
 * Imports the application module.
 *
 * @param {string} app The application module.
 */
const app = require('./app');

/**
 * Gets the database connection string from the environment variables.
 *
 * @returns {string} The database connection string.
 */
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/**
 * Sets the Mongoose strict query mode to false.
 */
mongoose.set('strictQuery', false);

/**
 * Connects to the database.
 *
 * @param {string} db The database connection string.
 * @param {object} options The connection options.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connect successfully...');
  });

/**
 * Gets the port number from the environment variables, or 3000 if it is not set.
 *
 * @returns {number} The port number.
 */
const port = process.env.PORT || 3000;

/**
 * Creates a new web server and listens on the specified port.
 *
 * @param {number} port The port number.
 * @param {function} callback The callback function.
 */
const server = app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});

/**
 * Sets up a handler for unhandled rejections.
 *
 * @param {Error} err The unhandled rejection.
 */
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGTH REJECTION Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
