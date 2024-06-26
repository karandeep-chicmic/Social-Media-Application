const Joi = require("joi");
const {
  createPost,
  getPosts,
  addAComment,
} = require("../controllers/postController");

const postRoutes = [
  {
    method: "POST",
    path: "/createPosts",
    schema: {
      body: {
        caption: Joi.string().required(),
        taggedPeople: Joi.array().optional(),
      },
    },

    auth: true,
    file: true,
    controller: createPost,
  },
  {
    method: "GET",
    path: "/getPosts",
    schema: {},
    auth: true,
    controller: getPosts,
  },
  {
    method: "POST",
    path: "/addComment",
    schema: {
      body: {
        postId: Joi.string().required(),
        comment: Joi.string().required(),
      },
    },
    file: false,
    auth: true,
    controller: addAComment,
  },
];

module.exports = postRoutes;
