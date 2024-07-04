const { socketsModel } = require("../models/chatModels/socketsModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const addSocket = async (payload) => {
  const { userId, socketId } = payload;
  const socket = await socketsModel.create({
    user: userId,
    socketId: socketId,
  });

  if (!socket) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.SOCKET_NOT_ADDED,
    };
  }

  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: socket,
    },
  };
};

const removeSocket = async (payload) => {
  const { userId, socketId } = payload;
  const socket = await socketsModel.deleteOne({
    user: userId,
    _id: socketId,
  });

  if (!socket) {
    return {
      statusCode: 400,
      data: RESPONSE_MSGS.FAILURE,
    };
  }

  return {
    statusCode: 200,
    data: RESPONSE_MSGS.SUCCESS,
  };
};

module.exports = { addSocket, removeSocket };
