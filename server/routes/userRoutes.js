const Joi = require("joi");
const {
  loginUser,
  registerUser,
  getUserDetails,
  getOwnDetails,
} = require("../controllers/userController");

const userRoutes = [
  {
    method: "POST",
    path: "/user/login",
    schema: {
      body: {
        username: Joi.string().required().min(8).max(15),
        password: Joi.string().required().min(8).max(15),
      },
    },
    auth: false,
    file: false,
    controller: loginUser,
  },
  {
    method: "POST",
    path: "/user/register",
    schema: {
      body: {
        name: Joi.string().required(),
        username: Joi.string().required().min(8).max(15),
        password: Joi.string().required().min(8).max(15),
        email: Joi.string().email().required(),
        file: Joi.string().optional(),
      },
    },
    auth: false,
    file: true,
    controller: registerUser,
  },
  {
    method: "GET",
    path: "/user/:friendId",
    schema: {
      params: {
        friendId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: getUserDetails,
  },
  {
    method: "GET",
    path: "/userDetails",
    schema: {},
    auth: true,
    file: false,
    controller: getOwnDetails,
  },
];

module.exports = userRoutes;
