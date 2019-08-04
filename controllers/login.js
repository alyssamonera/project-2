// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const Models = require('../models/models.js');

// ========
// CREATE
// ========
// REDIRECT SOLUTION FROM: https://stackoverflow.com/questions/49244589/how-to-redirect-2-pages-back-with-express-js-node-js

login.post('/', (req, res) => {
  Models.User.findOne({username: req.body.username}, (err, user) => {
    // Database error
    if (err){console.log(err)}

    // Checks username and password
    else if (!user || !bcrypt.compareSync(req.body.password, user.password)){
      res.render('login/new.ejs', {tabTitle: "Log In", currentUser: req.session.currentUser, referer: req.headers.referer, error: true})

    // All clear
    } else {
        req.session.currentUser = user;
        res.redirect(req.body.referer)
    }
  })
});

// ========
//  READ
// ========
login.get('/', (req, res) => {
  res.render('login/new.ejs', {tabTitle: "Log In", currentUser: req.session.currentUser, referer: req.headers.referer, error: false})
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
