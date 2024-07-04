const Joi = require("joi");
const {
  createPost,
  getPosts,
  addAComment,
  tagUsers,
  feedForUser,
  getCommentsOfPost,
  getUserSinglePost,
  updatePost
} = require("../controllers/postController");

const postRoutes = [
  {
    method: "POST",
    path: "/createPosts",
    schema: {
      body: {
        caption: Joi.string().required(),
        taggedPeople: Joi.string().optional(),
        file: Joi.string().optional(),
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
    file: false,
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
  {
    method: "POST",
    path: "/tagUsers",
    schema: {
      body: {
        postId: Joi.string().required(),
        taggedUsers: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required(),
              username: Joi.string().required(),
            })
          )
          .required(),
      },
    },
    file: false,
    auth: true,
    controller: tagUsers,
  },
  {
    method: "GET",
    path: "/feedForUser",
    schema: {
      query: {
        length: Joi.number().required(),
      },
    },
    file: false,
    auth: true,
    controller: feedForUser,
  },
  {
    method: "GET",
    path: "/getCommentsOfPost/:postId",
    schema: {
      query: {
        length: Joi.number().required(),
      },
      params: {
        postId: Joi.string().required(),
      },
    },
    file: false,
    auth: true,
    controller: getCommentsOfPost,
  },
  {
    method: "GET",
    path: "/getUserSinglePost/:postId",
    schema: {
      params: {
        postId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: getUserSinglePost,
  },
  {
    method: "PUT",
    path: "/updatePost/:postId",
    schema: {
      params: {
        postId: Joi.string().required(),
      },
      body: {
        caption: Joi.string().required(),
        file: Joi.string().optional()
      },
    },
    file: true,
    auth: true,
    controller: updatePost
  },
];

module.exports = postRoutes;
