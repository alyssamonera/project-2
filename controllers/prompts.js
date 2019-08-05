// ====================================================================
//                          PROMPT CONTROLLER
// ====================================================================

// ==============
// DEPENDENCIES
// ==============
const express = require('express');
const prompt = express.Router();
const Models = require ('../models/models.js');

// ======================
// HANDY-DANDY FUNCTIONS
// ======================

const tagSort = {
  // ====================
  // arrangeTags(array)
  // Prepares user input tags to be made into an array, accounting for the spaces in between tags
  // ====================
  arrangeTags: (array) => {
    array.shift();
    if (array.length > 1){
      for (let i = 0; i < array.length - 1; i++){
        array[i] = array[i].substring(0, array[i].length - 1)}
      }
    return array
  }
};

// ========
// CREATE
// ========
// NEW PROMPT
prompt.get('/new', (req, res) => {
  res.render('prompts/new.ejs', {tabTitle: "New prompt", currentUser: req.session.currentUser, error: false})
});

// NEW REPLY
prompt.get('/:id/reply/new', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
    res.render('replies/new.ejs', {tabTitle: "New story", currentUser: req.session.currentUser, promptId: req.params.id, prompt: prompt, error: false})
  })
});

// POST PROMPT
prompt.post('/', (req, res) => {
  // If the prompt has no title, send them back with an error message.
  if (!req.body.title){
    res.render('prompts/new.ejs', {tabTitle: "New prompt", currentUser: req.session.currentUser, error: true});
  } else {
    // Creates tag array
    req.body.tags = tagSort.arrangeTags(req.body.tags.split("#"))

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
  }
});

// POST REPLY
prompt.post('/:id/reply', (req, res) => {
  // If the reply has no title or body, send them back with an error message
  if (!req.body.body || !req.body.title){
    Models.Prompt.findById(req.params.id, (err, prompt) => {
      res.render('replies/new.ejs', {tabTitle: "New story", currentUser: req.session.currentUser, promptId: req.params.id, prompt: prompt, error: true})
    })
  } else {
    // Creates tag array
    req.body.tags = tagSort.arrangeTags(req.body.tags.split("#"))

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
  }

});

// ========
//  READ
// ========
// INDEX
prompt.get('/', (req, res) => {
  Models.Prompt.find({}, (err, allPrompts) => {
    res.render('prompts/index.ejs', {tabTitle: "Browse prompts", currentUser: req.session.currentUser, allPrompts: allPrompts, error: false})
  })
});

// SHOW PROMPT
prompt.get('/:id', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      Models.Prompt.find({}, (err, allPrompts) => {
        res.render('prompts/index.ejs', {tabTitle: "Browse prompts", currentUser: req.session.currentUser, allPrompts: allPrompts, error: true})
      })
    } else {
      res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt, error: false})
    }
  })
});

// SHOW REPLY
prompt.get('/:promptId/replies/:replyId', (req, res) => {
  Models.Reply.findById(req.params.replyId, (err, reply) => {
    if (!reply){
      Models.Prompt.findById(req.params.promptId, (err, prompt) => {
        res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt, error: true})
      })
    } else {
      res.render('replies/show.ejs', {tabTitle: "Read story", currentUser: req.session.currentUser, reply: reply})
    }
  })
});

// SHOW TAGGED PROMPTS
prompt.get('/tagged/:tag', (req, res) => {
  Models.Prompt.find({tags: req.params.tag}, (err, prompts) => {
    res.render('tagged/index.ejs', {tabTitle: `Tagged ${req.params.tag}`, currentUser: req.session.currentUser, posts: prompts, type: "prompt", tag: req.params.tag})
  })
});

// SHOW TAGGED REPLIES
prompt.get('/replies/tagged/:tag', (req, res) => {
  Models.Reply.find({tags: req.params.tag}, (err, replies) => {
    res.render('tagged/index.ejs', {tabTitle: `Tagged ${req.params.tag}`, currentUser: req.session.currentUser, posts: replies, type: "reply", tag: req.params.tag})
  })
})

// ========
//  UPDATE
// ========
// EDIT PROMPT
prompt.get('/:id/edit', (req, res) => {
  Models.Prompt.findById(req.params.id, (err, prompt) => {
    if (!prompt){
      Models.Prompt.find({}, (err, allPrompts) => {
        res.render('prompts/index.ejs', {tabTitle: "Browse prompts", currentUser: req.session.currentUser, allPrompts: allPrompts, error: true})
      })
    } else if (!req.session.currentUser || req.session.currentUser.username != prompt.author.username){
      res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt, error: true})
    } else {
      res.render('prompts/edit.ejs', {tabTitle: "Edit prompt", currentUser: req.session.currentUser, prompt: prompt})
    }
  })
});

// EDIT REPLY
prompt.get('/:promptId/replies/:replyId/edit', (req, res) => {
  Models.Reply.findById(req.params.replyId, (err, reply) => {
    if (!reply){
      Models.Prompt.findById(req.params.promptId, (err, prompt) => {
        res.render('prompts/show.ejs', {tabTitle: "Read prompt", currentUser: req.session.currentUser, prompt: prompt, error: true})
      })
    } else {
      res.render('replies/edit.ejs', {tabTitle: "Edit story", currentUser: req.session.currentUser, reply: reply})
    }
  })
})

// PUT PROMPT
prompt.put('/:id', (req, res) => {
  req.body.tags = tagSort.arrangeTags(req.body.tags.split("#"))

  Models.Prompt.findByIdAndUpdate(req.params.id, req.body, (err, prompt) => {
      for (let reply of prompt.replies){
        Models.Reply.findById(reply._id, (err, story) => {
          story.prompt.title = req.body.title;
          story.save();
        })
      }
      Models.User.findById(prompt.author.id, (err, user) => {
        user.prompts.id(req.params.id).set(req.body);
        user.save();
        res.redirect(`/prompts/${req.params.id}`)
      })
  })
});

// PUT REPLY
prompt.put('/:promptId/replies/:replyId', (req, res) => {
  req.body.tags = tagSort.arrangeTags(req.body.tags.split("#"))

  Models.Reply.findByIdAndUpdate(req.params.replyId, req.body, (err, reply) => {
    Models.Prompt.findById(req.params.promptId, (err, prompt) => {
      prompt.replies.id(req.params.replyId).set(req.body);
      prompt.save();
      Models.User.findById(reply.author.id, (err, user) => {
        user.replies.id(req.params.replyId).set(req.body);
        user.save();
        res.redirect(`/prompts/${req.params.promptId}/replies/${req.params.replyId}`);
      })
    })
  })
});

// LIKE PROMPT
prompt.put('/:id/like', (req, res) => {
  Models.Prompt.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}, (err, prompt) => {
    res.redirect(`/prompts/${req.params.id}`);
  })
});

// LIKE REPLY
prompt.put('/:promptId/replies/:replyId/like', (req, res) => {
  Models.Reply.findByIdAndUpdate(req.params.replyId, {$inc: {likes: 1}}, (err, reply) => {
    res.redirect(`/prompts/${req.params.promptId}/replies/${req.params.replyId}`)
  })
});

// ========
// DESTROY
// ========
// DELETE PROMPT
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

// DELETE REPLY
prompt.delete('/:promptId/replies/:replyId', (req, res) => {
  Models.Reply.findByIdAndRemove(req.params.replyId, (err, reply) => {
    Models.Prompt.findById(req.params.promptId, (err, prompt) => {
      prompt.replies.id(reply._id).remove();
      prompt.save();
      Models.User.findById(reply.author.id, (err, author) => {
        author.replies.id(reply._id).remove();
        author.save();
        res.redirect(`/prompts/${req.params.promptId}`);
      })
    })
  })
})

module.exports = prompt;
