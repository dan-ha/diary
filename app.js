var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const fs = require('fs-extra');
const hbs = require('hbs');

// Logging dependencies
var logger = require('morgan');
const rfs = require('rotating-file-stream');

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
