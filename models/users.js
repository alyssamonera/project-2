const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// I tried just requiring prompts.js but Mongoose won't let me use a model as a Schema type so I had to paste it here again
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

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  prompts: [promptSchema],
  avatar: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
