const { userModel } = require("../models/userModel");
const { otpModel } = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const { RESPONSE_MSGS, SECRET_KEY } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const otpSend = async (payload) => {
  try {
    // send otp logic here
    const { email } = payload;
    const checkUserPresent = await userModel.findOne({ email });
    console.log(checkUserPresent);

    if (checkUserPresent && checkUserPresent.isVerified) {
      return { statusCode: 400, data: RESPONSE_MSGS.ALREADY_VERIFIED };
    } else if (!checkUserPresent) {
      return { statusCode: 400, data: RESPONSE_MSGS.CREATE_USER };
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP IS:", otp);
    let result = await otpModel.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await otpModel.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await otpModel.create(otpPayload);

    console.log("OTP is :", otp);

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const otpVerify = async (payload) => {
  try {
    const { otp, email } = payload;
    const checkOtp = await otpModel.find({ email }).sort({ createdAt: -1 });

    if (checkOtp.length === 0) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.GENERATE_OTP_FIRST,
      };
    }

    const otpToMatch = checkOtp[0];
    console.log(otpToMatch);

    if (String(otp) === String(otpToMatch.otp)) {
      const userFound = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
        { new: true }
      );

      const token = jwt.sign(
        { id: userFound._id, email: userFound.email },
        SECRET_KEY,
        {
          expiresIn: "2500s",
        }
      );

      return {
        statusCode: 200,
        data: {
          message: RESPONSE_MSGS.OTP_VERIFIED_SUCCESSFULLY,
          token: token,
          email: userFound.email,
          userId: userFound._id,
        },
      };
    } else {
      return {
        statusCode: 400,
        data: {
          message: RESPONSE_MSGS.INVALID_OTP,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

module.exports = { otpSend, otpVerify };
