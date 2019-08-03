// ====================================================================
//                          PROMPT MODEL
// ====================================================================

// DEPENDENCIES
const mongoose = require('mongoose');

// SCHEMA
const promptSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  author: {type: String, required: true},
  tags: [String],
  responses: [{author: String, body: String, date: Date}],
  likes: {type: Number, default: 0, min: 0}
});

// MODEL
const Prompt = mongoose.model('Prompts', promptSchema);

// EXPORT
module.exports = Prompt;
