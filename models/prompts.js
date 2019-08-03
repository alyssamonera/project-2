// ====================================================================
//                          PROMPT MODEL
// ====================================================================

// DEPENDENCIES
const mongoose = require('mongoose');

// SCHEMA
const promptSchema = mongoose.Schema({
  prompt: {type: String, required: true},
  author: {type: String, required: true},
  tags: [String],
  responses: [{author: String, body: String, date: Date}],
  likes: {type: Number, default: 0, min: 0}
})

// MODEL
const Prompt = mongoose.model('Prompts', promptSchema);

// EXPORT
module.exports = Prompt;
