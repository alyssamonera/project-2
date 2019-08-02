// =============
// DEPENDENCIES
// =============
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
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

// ===========
//   ROUTES
// ===========
// localhost:3000
app.get('/', (req, res) => {
  res.render('index.ejs', {tabTitle: "Home"})
});

// ===========
//  LISTENER
// ===========
app.listen(PORT, () => console.log('Listening on port: ', PORT));

// ======================
// CONSOLE.LOG GRAVEYARD
// ======================
// console.log(process.env.MONGODB_URI);
