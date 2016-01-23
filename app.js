var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var mongo = require('mongodb');
var monk = require('monk');
var passport = require('passport');


var routes = require('./routes/main');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(session({ cookie: { maxAge: 60000 }}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    maxAge: 60000 
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


var db = monk('localhost:27017/IdentityManagement');
app.use(function(req,res,next){
    req.db = db;
    next();
});



LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function(username, password, done) {
	  console.log(username + " " + password);
	  
	  if (username=="1" && password=="1") {
		  return done(null, true);
	  } else {
		  return done(null, false, { message: 'Abe zadu sahi credetials dal.' });
	  }
 
  }));
 
  
passport.serializeUser(function(user, done) {
done(null, true);
});

passport.deserializeUser(function(id, done) {
done(null, true);
});


app.get('/login', function(req, res) {

	res.render('login', {message : req.flash('error')});
	
});

app.post('/login',   passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })

);

app.use(function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
});
 

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
	  stack: err.stack
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
