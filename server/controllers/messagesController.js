const { messagesModel } = require("../models/chatModels/messagesModel");
const { roomModel } = require("../models/chatModels/roomsModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const getMessages = async (payload) => {
  const { roomName, userId, length } = payload;
  console.log(roomName, userId);

  let getAllMsgs = await messagesModel
    .find({ roomId: roomName })
    .sort({ createdAt: -1 })
    .skip(length)
    .limit(6);
  // .populate("sendersId", ["username", "profilePicture", "name"]);

  const roomExistsOrNot = await roomModel.find({
    user: userId,
    roomName: roomName,
  });

  if (roomExistsOrNot.length < 1) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.NO_ROOMS_FOUND,
    };
  }

  if (getAllMsgs.length < 1) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.NO_MESSAGES,
    };
  }

  getAllMsgs = getAllMsgs.reverse();
  return {
    statusCode: 200,
    data: {
      messages: RESPONSE_MSGS.SUCCESS,
      data: getAllMsgs,
    },
  };
};

module.exports = { getMessages };
