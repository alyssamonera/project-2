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
  let tagArray = req.body.tags.split("# ");
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

// ========
//  UPDATE
// ========
// EDIT

// PUT

// ========
// DESTROY
// ========
// DELETE

module.exports = prompt;
