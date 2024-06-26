const otpRoutes = require("./otpRoutes")
const postRoutes = require("./postRoutes")
const userRoutes = require("./userRoutes")

const routes = [...userRoutes, ...otpRoutes, ...postRoutes]

module.exports = {routes}