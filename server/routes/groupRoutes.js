const Joi = require("joi");
const { createGroup, getUserGroups } = require("../controllers/groupController");

const groupRoutes = [
  {
    method: "POST",
    path: "/createGroup",
    schema: {
      body: {
        groupName: Joi.string().required(),
      },
    },
    auth: true,
    file: false,
    controller: createGroup,
  },
  {
    method: "GET",
    path: "/getUserGroups",
    schema: {
    },
    auth: true,
    file: false,
    controller: getUserGroups,

  }
];

module.exports = groupRoutes;
