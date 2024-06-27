const friendRoutes = require("./friendRoutes")
const likesRoute = require("./likesRoute")
const otpRoutes = require("./otpRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")

const routes = [...userRoutes, ...otpRoutes, ...postRoutes, ...friendRoutes, ...likesRoute]

module.exports = {routes}