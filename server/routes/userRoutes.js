const Joi = require("joi");
const { loginUser, registerUser } = require("../controllers/userController");

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
];

module.exports = userRoutes;
