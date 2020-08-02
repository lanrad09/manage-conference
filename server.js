var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo') (session);

// Start the web express application 
var app = express();

// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');




//Setup Routes
var routes = require('./server/routes/index');
var speakers = require('./server/routes/speakers');
//var users = require('./server/routes/users');

// Database configuration
var config = require('./server/config/config.js');

// passport configuration
require('./server/config/passport')(passport);

//Connect to the database
mongoose.connect(config.url, { useNewUrlParser: true , useUnifiedTopology: true}).then(() => console.log('DB Connected!'));

// Check if MongoDB is running
mongoose.connection.on('error', function(){
  console.log('MongoDB Connection Error. Make sure MongoDB is running');
});



// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

//app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
  secret: 'sometextgohere',
  saveUninitialized: true,
  resave: true,
  //store session on MongoDB using express-session + connect mongo
  
  store: new MongoStore({
      url: config.url,
      collection : 'sessions'
  }) 
}));

// Init passport authentication 
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());



// Flash warning messages
app.use(flash());

// Load routes
app.use('/', routes);
app.use('/api/speakers', speakers);
//app.use('/users', users);

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


app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + server.address().port);
});


