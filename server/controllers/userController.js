const { userModel } = require("../models/userModel");
const { ObjectId } = require("mongoose").Types;

const { RESPONSE_MSGS, BCRYPT, SECRET_KEY } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const friendsModel = require("../models/friendReqModel");

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

const getUserDetails = async (payload) => {
  const { userId, friendId } = payload;

  const user = await userModel.aggregate([
    {
      $match: {
        _id: new ObjectId(friendId),
      },
    },
    {
      $lookup: {
        from: "posts",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$userUploaded", "$$userId"] } } },
          { $sort: { createdAt: -1 } },

          // in future can add paging
          { $limit: 5 },
        ],
        as: "posts",
      },
    },
    {
      $project: { password: 0, updatedAt: 0, createdAt: 0, isVerified: 0 },
    },
  ]);
  if (String(friendId) === String(userId)) {
    user[0].userHimself = true;
    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        data: user,
      },
    };
  }

  const friends = await friendsModel.find({
    $and: [
      {
        $or: [
          { user: userId, friend: friendId },
          { user: friendId, friend: userId },
        ],
      },
      { reqAccepted: true },
    ],
  });
  if (friends.length === 0) {
    if (user[0].privacy === true) {
      return {
        statusCode: 400,
        data: {
          data: [
            {
              username: user[0].username,
              profilePicture: user[0].profilePicture,
            },
          ],
          message: RESPONSE_MSGS.NOT_FRIEND_AND_PRIVATE_ACC,
        },
      };
    }
  } else {
    user[0].friends = true;
    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        data: user,
      },
    };
  }

  user[0].friends = false;
  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: user,
    },
  };
};

const getOwnDetails = async (payload) => {
  const { userId } = payload;
  const userDetails = await userModel.findById(userId);

  if (!userDetails) {
    return {
      statusCode: 400,
      data: {
        message: RESPONSE_MSGS.USER_NOT_EXIST,
      },
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: userDetails,
    },
  };
};
module.exports = { loginUser, registerUser, getUserDetails, getOwnDetails };
