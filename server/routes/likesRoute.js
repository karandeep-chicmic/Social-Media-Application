const Joi = require("joi");
const { likeAPost } = require("../controllers/likesController");

const likesRoute = [
  {
    method: "POST",
    path: "/likes",
    schema: {
      body: {
        postId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: likeAPost,
  },
];

module.exports = likesRoute