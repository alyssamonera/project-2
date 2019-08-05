// ====================================================================
//                          USER CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const user = express.Router();
const Models = require('../models/models.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ========
//  READ
// ========
// INDEX
user.get('/', (req, res) => {
  Models.User.find({}, (err, allUsers) => {
    res.render('users/index.ejs', {tabTitle: "Browse users", currentUser: req.session.currentUser, allUsers: allUsers})
  })
});

// SHOW
user.get('/:id', (req, res) => {
  Models.User.findById(req.params.id, (err, user) => {
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
  Models.User.findById(req.params.id, (err, user) => {
    if (!user){
      res.send("<p>Hmm! That page doesn't exist. <a href='/'>Return</a> </p>")
    } else if (!req.session.currentUser || req.session.currentUser.username != user.username){
      res.send("<p>Hey! You don't have permission to edit this profile. <a href='/login'>Log in</a> or <a href='/'>return to the homepage.</a> </p>")
    } else {
      res.render('users/edit.ejs', {tabTitle: "Edit profile", currentUser: req.session.currentUser, user: user, error: false})
    }
  })
})

// PUT
user.put('/:id', (req, res) => {
  Models.User.findByIdAndUpdate(req.params.id, {username: req.body.username}, (err, user) => {
      if (err && err.code === 11000){
        res.render('users/edit.ejs', {tabTitle: "Edit profile", currentUser: req.session.currentUser, user: req.session.currentUser, error: true});
      } else {
        if (req.body.password != user.password){
          req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
          user.password = req.body.password;
          user.save();
        }
        res.redirect(`/users/${req.params.id}`)
  }})
});

// ========
// DESTROY
// ========
// DELETE
user.delete('/:id', (req, res) => {
  Models.User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err){console.log(err)}
    else{
      req.session.destroy( () => {
        res.redirect('/')
      });
    }
  })
});

module.exports = user;
