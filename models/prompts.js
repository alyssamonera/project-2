// ====================================================================
//                          PROMPT MODEL
// ====================================================================

// DEPENDENCIES
const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// SCHEMA
const promptSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  author: {
    id: {type: String, required: true},
    username: {type: String, required: true},
  },
  tags: Array,
  responses: [{author: String, body: String, date: Date}],
  likes: {type: Number, default: 0, min: 0}
});

// MODEL
const Prompt = mongoose.model('Prompts', promptSchema);

// EXPORT
module.exports = Prompt;
