/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const subscribersRouter = require('./routes/subscribersRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const researchRouter = require('./routes/researchRoute');
const shareholderRouter = require('./routes/shareholderRoute');

const app = express();
// set security http headers
app.use(helmet());
app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
//   );
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   next();
// });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against no-sql query inject and cross site attacks
// prevents query injections
app.use(mongoSanitize());

// limit requests from api
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

app.use('/api', limiter);

// body parser, reading data from body in req.body
app.use(express.json({ limit: '10kb' }));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// prevents xss attacks
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/subscribers', subscribersRouter);
app.use('/api/v1/researches', researchRouter);
app.use('/api/v1/shareholders', shareholderRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} at the moment`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
