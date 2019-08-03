// ==============
//  DEPENDENCIES
// ==============
const express = require('express');
const signup = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

// ========
//  CREATE
// ========
// NEW
signup.get('/', (req, res) => {
  res.render('signup/new.ejs', {tabTitle: "Sign Up", currentUser: req.session.currentUser})
});

// POST
signup.post('/', (req, res) => {
  User.find({username: req.body.username}, (err, user) => {
    if (user){
      res.send("Sorry, that username is taken. <a href='/signup'>Try again</a>")
    } else {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

      User.create(req.body, (err, user) => {
        if (err){console.log(err)}
        else {console.log(user); res.redirect('/')}
      })
    }
  })
});

module.exports = signup;
