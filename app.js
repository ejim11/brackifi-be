/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
// const cookieParser = require('cookie-parser');
const path = require('path');
const subscribersRouter = require('./routes/subscribersRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const researchRouter = require('./routes/researchRoute');
const shareholderRouter = require('./routes/shareholderRoute');
const reportRouter = require('./routes/docsAndReportsRoute');
const shareValueRouter = require('./routes/shareValueRoute');
const investorRouter = require('./routes/investorRoute');
const ordersRouter = require('./routes/ordersRoute');
const investmentsRouter = require('./routes/investmentRoute');
const roiValueRouter = require('./routes/roiValueRoute');
const businessNewsRouter = require('./routes/businessNewsRoute');
const fundPerfomanceCommentaryRouter = require('./routes/fundPerformanceCommentaryRoute');
const investmentPositionRouter = require('./routes/investmentPositionRoute');
const featuredPostRouter = require('./routes/featuredPostRoute');
const adminRouter = require('./routes/adminRoute');

const app = express();

app.set('trust proxy', 300);
app.get('/x-forwarded-for', (request, response) =>
  response.send(request.headers['x-forwarded-for']),
);

// set security http headers
app.use(helmet());
app.use(cors());

app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

app.use(express.static(path.join(__dirname, 'public')));

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
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

app.use('/api', limiter);

// body parser, reading data from body in req.body
app.use(express.json({ limit: '10kb' }));
// app.use(cookieParser());

// prevents xss attacks
app.use(xss());

// prevents parameter pollution
// try getting the field names from the model
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use('/api/v1/subscribers', subscribersRouter);
app.use('/api/v1/researches', researchRouter);
app.use('/api/v1/shareholders', shareholderRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/sharevalue', shareValueRouter);
app.use('/api/v1/investors', investorRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/investments', investmentsRouter);
app.use('/api/v1/roivalue', roiValueRouter);
app.use('/api/v1/business-news', businessNewsRouter);
app.use('/api/v1/fundPerformanceCommentaries', fundPerfomanceCommentaryRouter);
app.use('/api/v1/investmentPositions', investmentPositionRouter);
app.use('/api/v1/featured-posts', featuredPostRouter);
app.use('/api/v1/admin', adminRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} at the moment`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
