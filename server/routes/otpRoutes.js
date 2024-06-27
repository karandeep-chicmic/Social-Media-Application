const Joi = require("joi");
const { otpSend, otpVerify } = require("../controllers/otpController");

const otpRoutes = [
  {
    method: "POST",
    path: "/otp",
    schema: {
      body: {
        email: Joi.string().required(),
      },
    },
    auth: false,
    file: false,
    controller: otpSend,
  },
  {
    method: "POST",
    path: "/verifyOtp",
    schema: {
      body: {
        email: Joi.string().required(),
        otp: Joi.number().required(),
      },
    },
    auth: false,
    file: false,
    controller: otpVerify,
  },
];

module.exports = otpRoutes;
