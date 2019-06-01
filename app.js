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
//app.use(validator());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
})


const Routes = require('./routes');
app.use('/', Routes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

//error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})

module.exports = app;