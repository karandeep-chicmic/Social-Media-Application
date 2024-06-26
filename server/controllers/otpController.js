const { userModel } = require("../models/userModel");
const { otpModel } = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const { RESPONSE_MSGS } = require("../utils/constants");

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

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        otp: otp,
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
      await userModel.updateOne(
        { email: email },
        { $set: { isVerified: true } }
      );

      return {
        statusCode: 200,
        data: {
          message: RESPONSE_MSGS.OTP_VERIFIED_SUCCESSFULLY,
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
