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
  req.body.author = req.session.currentUser.username;

  // Adds the prompt to the author's prompts array
  User.findOneAndUpdate({username: req.body.author}, {$push: {prompts: req.body}}, (err, user) => {
    // Database error
    if (err) {console.log(err)}
    // If user can't be found. Shouldn't happen at this stage, but just in case
    else if (!user){
      res.send("You have to be logged in to do that. <a href='/login'>Log in here.</a>")
    // If we're all good, send a confirmation log and add the prompt to the database
    } else {
      Prompt.create(req.body, (err, data) => {
        console.log(`prompt successfully added to ${user.username}`);
        res.redirect('/prompts')
      })
    }
  });
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
// DELETE
prompt.delete('/:id', (req, res) => {
  Prompt.findByIdAndRemove(req.params.id, (err, prompt) => {
    if (err){console.log(err)}
    else{
      res.redirect('/prompts')
    }
  })
});

module.exports = prompt;
