// ====================================================================
//                          PROMPT CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const prompt = express.Router();
const Prompt = require('../models/prompts.js');

// ========
// CREATE
// ========
// NEW
prompt.get('/new', (req, res) => {
  res.render('prompts/new.ejs', {tabTitle: "New prompt", currentUser: req.session.currentUser})
});

// POST
prompt.post('/', (req, res) => {
  let tagArray = req.body.tags.split("#");
  tagArray.shift();
  req.body.tags = tagArray;

  req.body.author = req.session.currentUser.username;

  Prompt.create(req.body, (err, data) => {
    res.redirect('/prompts')
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
// DELETE

module.exports = prompt;
