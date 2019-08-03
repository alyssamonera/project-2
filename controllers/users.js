// ====================================================================
//                          USER CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const user = express.Router();
const Prompt = require('../models/prompts.js');
const User = require('../models/users.js');
const mongoose = require('mongoose');

// ========
//  READ
// ========
// INDEX
user.get('/', (req, res) => {
  User.find({}, (err, allUsers) => {
    res.render('users/index.ejs', {tabTitle: "Browse users", currentUser: req.session.currentUser, allUsers: allUsers})
  })
});

// SHOW
user.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user){
      res.send("<p>Hmm! That page doesn't exist. <a href='/'>Return to the homepage</a> </p>")
    } else {
      res.render('users/show.ejs', {tabTitle: "Profile", currentUser: req.session.currentUser, user: user})
    }
  })
});

// ========
//  UPDATE
// ========
// EDIT
user.get('/:id/edit', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user){
      res.send("<p>Hmm! That page doesn't exist. <a href='/'>Return</a> </p>")
    } else if (!req.session.currentUser || req.session.currentUser.username != user.username){
      res.send("<p>Hey! You don't have permission to edit this profile. <a href='/login'>Log in</a> or <a href='/'>return to the homepage.</a> </p>")
    } else {
      res.render('users/edit.ejs', {tabTitle: "Edit profile", currentUser: req.session.currentUser, user: user})
    }
  })
})

// PUT
user.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    if (err){console.log(err)}
    else {
      res.redirect(`/users/${req.params.id}`)
    }
  })
});

// ========
// DESTROY
// ========
// DELETE
user.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err){console.log(err)}
    else{
      res.redirect('/users')
    }
  })
});

module.exports = user;
