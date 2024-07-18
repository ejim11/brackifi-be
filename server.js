const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// allow access to the enviroment variables
dotenv.config({ path: './.env' });

// catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err, err.message);
  console.log('UNCAUGHT EXCEPTION 🚨 Shutting down!');
  process.exit(1);
});

//create the database
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// connect to the database
mongoose.connect(DB).then(() => {
  // console.log(connectionObj.connections);
  console.log('DB connection successfully established');
});

const port = process.env.PORT || 3000;

// listen to the server
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err, err.message);
  console.log('UNHANDLED REJECTION 🚨 Shutting down! ');
  server.close(() => {
    process.exit(1);
  });
});
