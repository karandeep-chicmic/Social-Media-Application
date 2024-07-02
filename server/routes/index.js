const friendRoutes = require("./friendRoutes");
const likesRoute = require("./likesRoute");
const { messagesRoutes } = require("./messagesRoutes");
const otpRoutes = require("./otpRoutes");
const postRoutes = require("./postRoutes");
const userRoutes = require("./userRoutes");

const routes = [
  ...userRoutes,
  ...otpRoutes,
  ...postRoutes,
  ...friendRoutes,
  ...likesRoute,
  ...messagesRoutes,
];

module.exports = { routes };
