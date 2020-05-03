var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
var exjwt = require('express-jwt');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');
var instructorsRouter = require('./routes/instructors');
var authenticationRouter = require('./routes/authentication');
var deployRouter = require('./routes/deploy');
var syncRouter = require('./routes/sync');

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api/users', exjwt({secret: 'testsec'}), usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/instructors', instructorsRouter);
app.use('/api/auth', authenticationRouter);
app.use('/api/deploy', deployRouter);
app.use('/api/sync', syncRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
    res.status(401).send(err);
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;