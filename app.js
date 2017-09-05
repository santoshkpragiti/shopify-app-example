var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const proxy = require('http-proxy-middleware');

// Require Keys from dev or prod depending on node env
const keys = require('./config/keys');

// Require the Routes files
var index = require('./routes/index');
var users = require('./routes/users');
const authRoutes = require('./routes/auth');

// Connect to MongoDB
mongoose.connect(keys.mongoUri, { useMongoClient: true });

// Verify that the connection is stablished
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Correctly Connected to MongoDB');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Public Paths
app.use(express.static(path.join(__dirname, 'public')));

// Define the express session
app.use(session({
  secret: keys.secretSession,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use('/', index);
app.use('/users', users);
app.use('/auth', authRoutes);

// Proxy enabled if in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use('/settings', proxy({target: 'http://localhost:8081'}));
  app.use('/static', proxy({target: 'http://localhost:8081'}));
  app.use('/sockjs-node', proxy({target: 'http://localhost:8081'}));
}else{
  const settingsRoutes = require('./routes/settings');
  // Express will serve up production assets main.js and main.css
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.use('/settings', settingsRoutes);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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