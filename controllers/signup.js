// ==============
//  DEPENDENCIES
// ==============
const express = require('express');
const signup = express.Router();
const Models = require('../models/models.js');
const bcrypt = require('bcrypt');

// ========
//  CREATE
// ========
// NEW
signup.get('/', (req, res) => {
  res.render('signup/new.ejs', {tabTitle: "Sign Up", currentUser: req.session.currentUser, error: false})
});

// POST
signup.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    if (req.body.avatar === ""){
      req.body.avatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/500px-User_font_awesome.svg.png"
    }

    Models.User.create(req.body, (err, user) => {
      if (err && err.code === 11000){
        res.render('signup/new.ejs', {tabTitle: "Sign Up", currentUser: req.session.currentUser, error: true})
      } else if (err && err.code != 11000){
        res.send('Something went wrong. Contact an administrator or <a href="/">return here.</a>')
      } else {
        req.session.currentUser = user;
        res.redirect('/')}
    })
});

module.exports = signup;
