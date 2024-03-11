const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

console.log(process.env.DATABASE_PASSWORD);

console.log(DB);

mongoose.connect(DB).then(() => {
  // console.log(connectionObj.connections);
  console.log('DB connection successfully established');
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
