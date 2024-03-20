/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const subscribersRouter = require('./routes/subscribersRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const researchRouter = require('./routes/researchRoute');
const shareholderRouter = require('./routes/shareholderRoute');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
