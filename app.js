const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');

require('./db');
require('./config/passport');
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(validator());


const Routes = require('./routes');
app.use('/', Routes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
})

//error handler
app.use((err, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})

module.exports = app;