const Joi = require("joi");
const { getMessages } = require("../controllers/messagesController");

const messagesRoutes = [
  {
    method: "GET",
    path: "/messages",
    schema: {
      query: {
        roomName: Joi.string().required(),
        length: Joi.number().required()
      },
    },
    file: false,
    auth: true,
    controller: getMessages
  }
];

module.exports = { messagesRoutes };
