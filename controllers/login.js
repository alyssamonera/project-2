// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');

// ========
// CREATE
// ========
login.post('/', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err){console.log(err)}
    else if (!user){res.redirect('/signup')}
    else{
      if (bcrypt.compareSync(req.body.password, user.password)){
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.send('<a href="/">wrong password</a>')
      }
    }
  })
});

// ========
//  READ
// ========
login.get('/', (req, res) => {
  res.render('login/new.ejs', {tabTitle: "Log In", currentUser: req.session.currentUser})
});

// ========
// DESTROY
// ========
login.delete('/', (req, res) => {
  req.session.destroy( () => {
    res.redirect('/')
  })
});

module.exports = login;
