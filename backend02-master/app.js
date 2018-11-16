var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var sessionVerifier = require('./modules/session-verifier');
var logger = require('morgan');
var device = require('express-device');

require('./modules/authentication-verifier');

var allRouter = require('./routes/all');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var userRouter = require('./routes/user');
var fileRouter = require('./routes/file');

var app = express();

config.application.systemPath = __dirname;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(device.capture({ parseUserAgent: true }));

app.use(sessionVerifier.restoreSessionFix);
app.use(allRouter);
app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/file', fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
