const Joi = require("joi");
const {
  sendFriendReq,
  acceptFriendReq,
  friendsOrNot,
  deleteFriend,
  getFriendRequests,
  getUserFriends,
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
  {
    method: "GET",
    path: "/friendsOrNot/:friendId",
    schema: {
      params: {
        friendId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: friendsOrNot,
  },
  {
    method: "DELETE",
    path: "/deleteFriend/:friendId",
    schema: {
      params: {
        friendId: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: deleteFriend,
  },
  {
    method: "GET",
    path: "/getFriendRequests",
    schema: {},
    auth: true,
    file: false,
    controller: getFriendRequests,
  },
  {
    method: "GET",
    path: "/getUserFriends",
    schema: {},
    auth: true,
    file: false,
    controller: getUserFriends,
  },
];

module.exports = friendRoutes;
