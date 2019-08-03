// =============
// DEPENDENCIES
// =============
// EXPRESS
const express = require('express');
const app = express();

// EXPRESS-SESSION
const session = require('express-session');

// METHOD-OVERRIDE
const methodOverride = require('method-override');

// MONGOOSE
const mongoose = require('mongoose');
const db = mongoose.connection;

// =======
//  PORT
// =======
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

// =========
// DATABASE
// =========
// Connects to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Addresses depreciation warnings from Mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Connect to Mongo
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
db.once('open', () => {console.log("connected to mongo")});

// ===========
// MIDDLEWARE
// ===========

// STATIC
app.use(express.static('public'));

// BODYPARSER: POPULATE REQ.BODY WITH FORM INFO
app.use(express.urlencoded({extended: false}));

// RETURNS MIDDLEWARE THAT ONLY PARSES JSON
app.use(express.json());

// METHOD OVERRIDE
app.use(methodOverride('_method'));

// EXPRESS SESSION
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

// ===========
//   ROUTES
// ===========
// localhost:3000
app.get('/', (req, res) => {
  res.render('index.ejs', {tabTitle: "Home", currentUser: req.session.currentUser})
});

app.get('/browse', (req, res) => {
  res.render('browse.ejs', {tabTitle: "Browse", currentUser: req.session.currentUser})
});

// SIGNUP CONTROLLER
const signupController = require('./controllers/signup.js');
app.use('/signup', signupController);

// LOGIN CONTROLLER
const loginController = require('./controllers/login.js');
app.use('/login', loginController);

// PROMPT CONTROLLER
const promptController = require('./controllers/prompts.js');
app.use('/prompts', promptController);

// USER CONTROLLER
const userController = require('./controllers/users.js');
app.use('/users', userController);

// ===========
//  LISTENER
// ===========
app.listen(PORT, () => console.log('Listening on port: ', PORT));

// ======================
// CONSOLE.LOG GRAVEYARD
// ======================
// console.log(process.env.MONGODB_URI);
