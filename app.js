var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const fs = require('fs-extra');
const util = require('util');
const hbs = require('hbs');

// Logging dependencies
var logger = require('morgan');
const rfs = require('rotating-file-stream');
const error = require('debug')('diary:error');

var indexRouter = require('./routes/index');
var entryRouter = require('./routes/entries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/entry', entryRouter);

// Setup logging
var logStream;
// Log to a file if requested (with rotaing-file-stream)
if (process.env.REQUEST_LOG_FILE) {
  (async() => {
    let logDirectory = path.dirname(process.env.REQUEST_LOG_FILE);
    await fs.ensureDir(logDirectory);
    logStream = rfs(process.env.REQUEST_LOG_FILE, {
      size: '10M',      // rotate every 10 MegaBytes written
      interval: '1d',   // rotate daily
      compress: 'gzip'  // compress rotated files
    });
  })().catch(err => { console.error(err); });
}
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: logStream ? logStream : process.stdout
}));

// Error handling
process.on('uncaughtException', function(err) {
  error("I've crashed!!! - " + (err.stack || err));
})

process.on('unhandledRejection', (reason, p) => {
  error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
})

if(app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    // util.log(err.message);
    res.status(err.status || 500);
    error((err.status || 500) + ' ' + error.message);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  // util.log(err.message);
  res.status(err.status || 500);
  error((err.status || 500) + ' ' + error.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
