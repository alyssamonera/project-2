// ====================================================================
//                          REPLY MODEL
// ====================================================================

// DEPENDENCIES
const mongoose = require('mongoose');

// SCHEMA
const replySchema = mongoose.Schema({
  title: String,
  body: {type: String, required: true},
  author: {
    id: {type: String, required: true},
    username: {type: String, required: true},
  },
  prompt: {
    id: {type: String, required: true},
    title: {type: String, required: true}
  },
  tags: Array,
  date: Date,
  likes: {type: Number, default: 0, min: 0}
});

// MODEL

// EXPORT
// module.exports = Reply;
