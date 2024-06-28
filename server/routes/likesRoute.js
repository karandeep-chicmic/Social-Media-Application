const Joi = require("joi");
const { likeAPost, dislikeAPost } = require("../controllers/likesController");

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
  {
    method: "DELETE",
    path: "/dislike/:postId",
    schema: {
      params: {
        postId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: dislikeAPost,
  },
];

module.exports = likesRoute;
