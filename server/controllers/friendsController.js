const friendsModel = require("../models/friendReqModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const sendFriendReq = async (payload) => {
  try {
    const { userId, friendReqUserId } = payload;

    const findReq = await friendsModel.find({
      $or: [
        { $and: [{ user: userId }, { friend: friendReqUserId }] },
        { $and: [{ user: friendReqUserId }, { friend: friendReqUserId }] },
      ],
    });

    if (findReq.length !== 0) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.REQ_ALREADY_PRESENT,
      };
    }
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

const deleteFriend = async (payload) => {
  const { userId, friendId } = payload;
  const deleted = await friendsModel.deleteOne({
    $or: [
      { user: userId, friend: friendId },
      { user: friendId, friend: userId },
    ],
  });

  if (!deleted) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.NOT_FRIENDS,
    };
  }

  return {
    statusCode: 200,
    data: RESPONSE_MSGS.FRIENDS_DELETED,
  };
};

const getFriendRequests = async (payload) => {
  const { userId } = payload;

  const friendRequests = await friendsModel
    .find({
      friend: userId,
      reqAccepted: false,
    })
    .populate("user", ["profilePicture", "username"]);

  if (friendRequests.length === 0) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.NO_FRIEND_REQUESTS,
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: friendRequests,
    },
  };
};

const getUserFriends = async (payload) => {
  const { userId } = payload;
  const findUserFriends = await friendsModel.find({
    $and: [
      {
        $or: [{ user: userId }, { friend: userId }],
      },
      {
        reqAccepted: true,
      },
    ],
  });

  await friendsModel.populate(findUserFriends, {
    path: "user",
    select: ["username", "profilePicture", "name", "email"],
  });

  await friendsModel.populate(findUserFriends, {
    path: "friend",
    select: ["username", "profilePicture", "name", "email"],
  });

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: findUserFriends,
    },
  };
};

// the above and below api can be merged into one

const getUserFriendsNumber = async (payload) => {
  const { id } = payload;
  const findUserFriends = await friendsModel.find({
    $and: [
      {
        $or: [{ user: id }, { friend: id }],
      },
      {
        reqAccepted: true,
      },
    ],
  });

  await friendsModel.populate(findUserFriends, {
    path: "user",
    select: ["username", "profilePicture", "name", "email"],
  });

  await friendsModel.populate(findUserFriends, {
    path: "friend",
    select: ["username", "profilePicture", "name", "email"],
  });

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: findUserFriends,
    },
  };
};

module.exports = {
  sendFriendReq,
  acceptFriendReq,
  friendsOrNot,
  deleteFriend,
  getFriendRequests,
  getUserFriends,
  getUserFriendsNumber,
};
