// ====================================================================
//                          PROMPT CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const prompt = express.Router();
const Prompt = require('../models/prompts.js');
const User = require('../models/users.js');

// ========
// CREATE
// ========
// NEW
prompt.get('/new', (req, res) => {
  res.render('prompts/new.ejs', {tabTitle: "New prompt", currentUser: req.session.currentUser})
});

// POST
prompt.post('/', (req, res) => {
  // Creates tag array
  let tagArray = req.body.tags.split("#");
  tagArray.shift();
  req.body.tags = tagArray;

  // Sets the author
  req.body.author = {};
  req.body.author.username = req.session.currentUser.username;
  req.body.author.id = req.session.currentUser._id;

  Prompt.create(req.body, (err, data) => {

    User.findByIdAndUpdate(
      req.body.author.id,
      {$push: {prompts: data}},
      {new: true},
      (err, user) => {
        if (err){console.log(err)}
        else {
          console.log("prompt successfully added to user");
          res.redirect('/prompts');}
      })
  })
});

// ========
//  READ
// ========
// INDEX
prompt.get('/', (req, res) => {
  Prompt.find({}, (err, allPrompts) => {
    res.render('prompts/index.ejs', {tabTitle: "Browse prompts", currentUser: req.session.currentUser, allPrompts: allPrompts})
  })
});

// SHOW
prompt.get('/:id', (req, res) => {
  Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      res.send("<p>Hmm! That prompt doesn't exist. <a href='/'>Return to the homepage</a> </p>")
    } else {
      res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt})
    }
  })
});

// ========
//  UPDATE
// ========
// EDIT
prompt.get('/:id/edit', (req, res) => {
  Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      res.send("<p>Hmm! That prompt doesn't exist. <a href='/'>Return</a> </p>")
    } else if (!req.session.currentUser || req.session.currentUser.username != prompt.author){
      res.send("<p>Hey! You don't have permission to edit this prompt. <a href='/login'>Log in</a> or <a href='/'>return to the homepage.</a> </p>")
    } else {
      res.render('prompts/edit.ejs', {tabTitle: "Edit prompt", currentUser: req.session.currentUser, prompt: prompt})
    }
  })
})

// PUT
prompt.put('/:id', (req, res) => {
  Prompt.findByIdAndUpdate(req.params.id, req.body, (err, prompt) => {
    if (err){console.log(err)}
    else {
      res.redirect(`/prompts/${req.params.id}`)
    }
  })
});

// ========
// DESTROY
// ========
// Couldn't figure out how to $pull a prompt by id, so the imperfect solution here is to find and delete by title and body
// DELETE
prompt.delete('/:id', (req, res) => {
  Prompt.findByIdAndRemove(req.params.id, (err, prompt) => {
    let userId = prompt.author.id;
    User.findByIdAndUpdate(
      userId,
      {$pull: {'prompts': {title: prompt.title, body: prompt.body}}},
      (err, user) => {
          res.redirect('/prompts');
    })
  })
});

module.exports = prompt;
