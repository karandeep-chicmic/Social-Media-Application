const friendsModel = require("../models/friendReqModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const sendFriendReq = async (payload) => {
  try {
    const { userId, friendReqUserId } = payload;

    const sendReq = await friendsModel.create({
      user: userId,
      friend: friendReqUserId,
      reqAccepted: false,
    });

    if (!sendReq) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILURE,
      };
    }

    return {
      statusCode: 201,
      data: RESPONSE_MSGS.FRIEND_REQUEST_SENT,
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const acceptFriendReq = async (payload) => {
  try {
    // PUT
    const { id, userId } = payload;

    const findReq = await friendsModel.findById(id);
    if (findReq) {
      if (findReq.friend.toString() !== userId.toString()) {
        return {
          statusCode: 400,
          data: RESPONSE_MSGS.FAILURE,
        };
      }
    }

    const updateReq = await friendsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { reqAccepted: true },
      }
    );
    console.log(updateReq);
    if (!updateReq) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILURE,
      };
    }

    return {
      statusCode: 200,
      data: RESPONSE_MSGS.FRIEND_REQUEST_ACCEPTED,
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const friendsOrNot = async (payload) => {
  const { userId, friendId } = payload;

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
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.NOT_FRIENDS,
    };
  }

  return {
    statusCode: 200,
    data: RESPONSE_MSGS.FRIENDS,
  };
};

module.exports = { sendFriendReq, acceptFriendReq, friendsOrNot };
