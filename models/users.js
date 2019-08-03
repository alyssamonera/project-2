const mongoose = require('mongoose');

// I tried just requiring prompts.js but Mongoose won't let me use a model as a Schema type so I had to paste it here again
const promptSchema = mongoose.Schema({
  prompt: {type: String, required: true},
  author: {type: String, required: true},
  tags: [String],
  responses: [{author: String, body: String, date: Date}],
  likes: {type: Number, default: 0, min: 0}
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  prompts: [promptSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;