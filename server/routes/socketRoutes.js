const Joi = require("joi");
const { addSocket, removeSocket } = require("../controllers/socketsController");

const socketRoute = [
  {
    method: "POST",
    path: "/socket",
    schema: {
      body: {
        socketId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: addSocket,
  },

  {
    method: "DELETE",
    path: "/removeSocket/:socketId",
    schema: {
      params: {
        socketId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: removeSocket,
  },
];

module.exports = socketRoute;
