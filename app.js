var createError = require('http-errors');
var express = require("express");
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors')
const bodyParser = require('body-parser');
const app = express();

app.use(session({
      secret: 'ssshhhhh',
      saveUninitialized: true,
      resave: true
  }))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
require('./routes/api')(app);
require('./routes/admin')(app);
require('./controllers/chatController');
require('./controllers/middlewares/adminMiddleware');
// parse application/json
app.use(bodyParser.json())


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404page');
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err});
});

module.exports = app;
