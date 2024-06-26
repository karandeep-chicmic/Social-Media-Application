const friendRoutes = require("./friendRoutes")
const otpRoutes = require("./otpRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")

const routes = [...userRoutes, ...otpRoutes, ...postRoutes, ...friendRoutes]

module.exports = {routes}