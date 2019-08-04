// ====================================================================
//                             MODELS
// ====================================================================
// * NOTE: Mongoose won't let me use models as Schema types, so I ended up putting all my models in one JS file.

// ==============
// DEPENDENCIES
// ==============
const mongoose = require('mongoose');

// ==============
//  PROMPT SCHEMA
// ==============
const promptSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  author: {
    id: {type: String, required: true},
    username: {type: String, required: true},
  },
  tags: [String],
  responses: [{author: String, body: String, date: Date}],
  likes: {type: Number, default: 0, min: 0}
});

// ===================
//    REPLY SCHEMA
// ===================
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

// ===================
//    USER SCHEMA
// ===================
const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  prompts: [promptSchema],
  replies: [replySchema],
  avatar: String
});

// ===================
// SCHEMAS ==> MODELS
// ===================
const User = mongoose.model('User', userSchema);
const Prompt = mongoose.model('Prompts', promptSchema);
const Reply = mongoose.model('Prompts', promptSchema);


// ===================
//      EXPORTS
// ===================
module.exports = {
  User: User,
  Prompt: Prompt,
  Reply: Reply }
