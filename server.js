const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log(err, err.message);
  console.log('UNCAUGHT EXCEPTION 🚨 Shutting down!');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  // console.log(connectionObj.connections);
  console.log('DB connection successfully established');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err, err.message);
  console.log('UNHANDLED REJECTION 🚨 Shutting down! ');
  server.close(() => {
    process.exit(1);
  });
});
