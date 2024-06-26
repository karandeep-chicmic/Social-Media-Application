const Joi = require("joi");
const {
  sendFriendReq,
  acceptFriendReq,
} = require("../controllers/friendsController");
const friendRoutes = [
  {
    method: "POST",
    path: "/sendRequest",
    schema: {
      body: {
        friendReqUserId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: sendFriendReq,
  },
  {
    method: "PUT",
    path: "/acceptRequest",
    schema: {
      query: {
        id: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: acceptFriendReq,
  },
];

module.exports = friendRoutes;
