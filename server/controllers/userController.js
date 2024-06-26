const { userModel } = require("../models/userModel");

const { RESPONSE_MSGS, BCRYPT, SECRET_KEY } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const loginUser = async (payload) => {
  const { username, password } = payload;

  var passwordMatch;
  var userFound = await userModel.findOne({ username: username });

  if (userFound) {
    passwordMatch = bcrypt.compareSync(password, userFound.password);
  } else {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.USER_NOT_EXIST,
    };
  }
  if (!userFound.isVerified) {
    return {
      statusCode: 421,
      data: {
        message: RESPONSE_MSGS.VERIFY_EMAIL,
        email: userFound.email,
      },
    };
  }

  if (passwordMatch) {
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
        message: RESPONSE_MSGS.SUCCESS,
        token: token,
        email: userFound.email,
        userId: userFound._id,
      },
    };
  } else {
    return {
      statusCode: 401,
      data: RESPONSE_MSGS.WRONG_PASSWORD,
    };
  }
};

const registerUser = async (payload) => {
  const { name, username, email, password, file } = payload;

  const userExist = await userModel.findOne({
    username: username,
    email: email,
  });
  if (userExist && userExist.isVerified) {
    return {
      statusCode: 409,
      data: RESPONSE_MSGS.USER_EXIST,
    };
  } else if (userExist && !userExist.isVerified) {
    return {
      statusCode: 421,
      data: {
        message: RESPONSE_MSGS.VERIFY_EMAIL,
        email: userExist.email,
      },
    };
  }

  const salt = bcrypt.genSaltSync(BCRYPT.SALT_ROUNDS);

  const objToSaveToDb = {
    name: name,
    username: username,
    password: bcrypt.hashSync(password, salt),
    email: email,
    profilePicture: file.path,
  };

  const registerUserM = await userModel.create(objToSaveToDb);

  const response = {
    message: "User Added Successfully",
    userDetails: registerUserM,
    userId: registerUserM._id,
  };

  return {
    statusCode: 201,
    data: response,
  };
};

module.exports = { loginUser, registerUser };
