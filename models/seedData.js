const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const ahlisa = {
  username: "ahlisa",
  password: bcrypt.hashSync("boo", bcrypt.genSaltSync(10)),
  avatar: "https://idigitalcitizen.files.wordpress.com/2009/08/snoopy-woodstock-sq.jpg",
  prompts: []
};

const hate = {
  title: "Write from the perspective of someone you hate.",
  author: {
    id: "TBD",
    username: "ahlisa"
  },
  tags: ["pov", "character study"],
};

const agarocks = {
  username: "agarocks",
  password: bcrypt.hashSync("green", bcrypt.genSaltSync(10)),
  replies: []
};

module.exports = {
  user: ahlisa,
  prompt: hate,
  author: agarocks
}
