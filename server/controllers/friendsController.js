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

module.exports = { sendFriendReq, acceptFriendReq };
