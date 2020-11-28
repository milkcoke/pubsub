const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '.env')});

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const updateRouter = require('./routes/update');
const waitingCustomerRouter = require('./routes/waiting-customers');
const app = express();
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session');
global.users = [];

const initializedPassport = require('./config/passport');
initializedPassport(passport, id=>{
  return users.find(user=> user.id === id);
});

//In sie
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//flash & session -> instantiate passport
app.use(flash());
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/:id/update', updateRouter);
app.use('/:storeId/waiting-customers', waitingCustomerRouter);

app.use('/login', loginRouter);
app.use('/register', registerRouter);

// posts test for JWT
app.use('/posts', require('./routes/jwt_test/posts'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(error, request, response, next) {
  // set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  // render the error page
  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;
