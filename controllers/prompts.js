// ====================================================================
//                          PROMPT CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const prompt = express.Router();
const Models = require ('../models/models.js');

// ========
// CREATE
// ========
// NEW PROMPT
prompt.get('/new', (req, res) => {
  res.render('prompts/new.ejs', {tabTitle: "New prompt", currentUser: req.session.currentUser})
});

// NEW REPLY
prompt.get('/:id/reply/new', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
      if(err){console.log(err)}
      else {
        res.render('replies/new.ejs', {tabTitle: "New story", currentUser: req.session.currentUser, promptId: req.params.id, prompt: prompt})
      }
  })
});

// POST PROMPT
prompt.post('/', (req, res) => {
  // Creates tag array
  let tagArray = req.body.tags.split("#");
  tagArray.shift();
  req.body.tags = tagArray;

  // Sets the author
  req.body.author = {};
  req.body.author.username = req.session.currentUser.username;
  req.body.author.id = req.session.currentUser._id;

  let prompt = new Models.Prompt(req.body);

  Models.User.findById(req.body.author.id, (err, user) => {
    user.prompts.push(prompt);
    user.save();
    prompt.save();
    res.redirect('/prompts');
  })
});

// POST REPLY
prompt.post('/:id/reply', (req, res) => {
  // Creates tag array
  let tagArray = req.body.tags.split("#");
  tagArray.shift();
  req.body.tags = tagArray;

  // Sets the author
  req.body.author = {};
  req.body.author.username = req.session.currentUser.username;
  req.body.author.id = req.session.currentUser._id;

  // Sets the prompt;
  req.body.prompt = {};
  req.body.prompt.id = req.params.id;
  req.body.prompt.title = req.body.promptTitle;

  // Sets the date
  req.body.date = new Date();

  let reply = new Models.Reply(req.body);

  Models.Prompt.findById(req.params.id, (err, prompt) => {
    prompt.replies.push(reply);
    prompt.save();
    Models.User.findById(prompt.author.id, (err, user) => {
      user.prompts.id(req.params.id).replies.push(reply);
      user.save();
      Models.User.findById(req.body.author.id, (err, author) => {
        author.replies.push(reply);
        author.save();
        reply.save();
        res.redirect(`/prompts/${req.params.id}`)
      })
    })
  })

});

// ========
//  READ
// ========
// INDEX
prompt.get('/', (req, res) => {
  Models.Prompt.find({}, (err, allPrompts) => {
    res.render('prompts/index.ejs', {tabTitle: "Browse prompts", currentUser: req.session.currentUser, allPrompts: allPrompts})
  })
});

// SHOW PROMPT
prompt.get('/:id', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      res.send("<p>Hmm! That prompt doesn't exist. <a href='/'>Return to the homepage</a> </p>")
    } else {
      res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt})
    }
  })
});

// SHOW REPLY
prompt.get('/:promptId/replies/:replyId', (req, res) => {
  Models.Reply.findById(req.params.replyId, (err, reply) => {
    if (!reply){
      res.send(`<p>Hmm! That story doesn't exist. <a href='/prompts/${req.params.promptId}'>Return</a> </p>`)
    } else {
      res.render('replies/show.ejs', {tabTitle: "Read story", currentUser: req.session.currentUser, reply: reply})
    }
  })
})

// ========
//  UPDATE
// ========
// EDIT
prompt.get('/:id/edit', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      res.send("<p>Hmm! That prompt doesn't exist. <a href='/'>Return</a> </p>")
    } else if (!req.session.currentUser || req.session.currentUser.username != prompt.author.username){
      res.send("<p>Hey! You don't have permission to edit this prompt. <a href='/login'>Log in</a> or <a href='/'>return to the homepage.</a> </p>")
    } else {
      res.render('prompts/edit.ejs', {tabTitle: "Edit prompt", currentUser: req.session.currentUser, prompt: prompt})
    }
  })
})

// PUT
prompt.put('/:id', (req, res) => {
  let tagArray = req.body.tags.split("#");
  tagArray.shift();
  req.body.tags = tagArray;

  Models.Prompt.findByIdAndUpdate(req.params.id, req.body, (err, prompt) => {
    if (err){console.log(err)}
    else {
      Models.User.findById(prompt.author.id, (err, user) => {
        let updatedPrompt = user.prompts.id(req.params.id);
        let submittedChanges = req.body;
        updatedPrompt.title = submittedChanges.title;
        updatedPrompt.tags = submittedChanges.tags;
        updatedPrompt.body = submittedChanges.body;
        updatedPrompt._id = prompt._id;
        user.save();
        res.redirect(`/prompts/${req.params.id}`)
      })
    }
  })
});

// ========
// DESTROY
// ========
// DELETE
prompt.delete('/:id', (req, res) => {
  Models.Prompt.findByIdAndRemove(req.params.id, (err, prompt) => {
    let userId = prompt.author.id;
    Models.User.findById(userId, (err, user) => {
        user.prompts.id(prompt.id).remove();
        user.save();
        res.redirect('/prompts');
    })
  })
});

module.exports = prompt;
