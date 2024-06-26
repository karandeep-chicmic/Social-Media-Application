const otpRoutes = require("./otpRoutes")
const userRoutes = require("./userRoutes")

const routes = [...userRoutes, ...otpRoutes]

module.exports = {routes}