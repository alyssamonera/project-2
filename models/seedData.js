const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const ahlisa = {
  username: "ahlisa",
  password: bcrypt.hashSync(process.env.PW1, bcrypt.genSaltSync(10)),
  prompts: [],
  avatar: "https://66.media.tumblr.com/ff35fd3f1cd7c7562c70dea9cd7bbd38/tumblr_pqjh6uHlSU1qf8em3o3_400.jpg"
};

const agarocks = {
  username: "agarocks",
  password: bcrypt.hashSync(process.env.PW2, bcrypt.genSaltSync(10)),
  avatar: "https://idigitalcitizen.files.wordpress.com/2009/08/snoopy-woodstock-sq.jpg",
  prompts: []
};

const dayinjuly = {
  username: "dayinjuly",
  password: bcrypt.hashSync(process.env.PW3, bcrypt.genSaltSync(10)),
  prompts: []
};

const hate = {
  title: "Write from the perspective of someone you hate.",
  author: {
    id: "TBD",
    username: "ahlisa"
  },
  tags: ["pov", "character study", "prompt"],
};

const horror = {
  title: "Write a horror story based on one of these images.",
  author: {
    id: "TBD",
    username: "dayinjuly"
  },
  body: `<p><img src="https://i.dailymail.co.uk/i/pix/2014/07/10/article-2687196-1F891DD200000578-480_964x639.jpg" style="width: 586px;"></p><p><img src="https://i.dailymail.co.uk/i/pix/2014/07/10/article-2687196-1F891E7400000578-550_964x646.jpg" style="width: 586px;"></p><p><img src="https://i.dailymail.co.uk/i/pix/2014/07/10/article-2687196-1F89209D00000578-713_964x636.jpg" style="width: 586px;"><br></p>`,
  tags: ["horror", "image prompt", "setting", "prompt"]
};

const angst = {
  title: "Free-write until the end of this song.",
  author: {
    id: "TBD",
    username: "agarocks"
  },
  body: `<p><iframe frameborder="0" src="//www.youtube.com/embed/NMBBJn5aCDg" width="640" height="360" class="note-video-clip"></iframe><br></p>`,
  tags: ["angst", "video prompt", "music prompt", "prompt"]
}

module.exports = {
  users: [ahlisa, dayinjuly, agarocks],
  prompts: [hate, horror, angst]
}
