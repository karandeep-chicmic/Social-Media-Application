const { messagesModel } = require("../models/chatModels/messagesModel");
const { roomModel } = require("../models/chatModels/roomsModel");
const { SOCKET_EVENTS } = require("../utils/constants");
const { userModel } = require("../models/userModel");

// Creating a room name for user
const createRoomName = (senderId, receiverId) => {
  return [senderId, receiverId].sort().join("-");
};

const events = async (socket, io) => {
  console.log("New user connected to chat with id : ", socket.id);
  
  // join room by roomName
  socket.on(SOCKET_EVENTS.JOIN_BY_ROOM_NAME, (roomName) => {
    socket.join(roomName);
  });

  // Join Group
  socket.on(SOCKET_EVENTS.GROUP_JOIN, async (userId, roomName, callback) => {
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }

    try {
      socket.join(roomName);
      const data = await roomModel.findOneAndUpdate(
        { roomName: roomName, user: userId },
        {
          $set: {
            roomName: roomName,
            user: userId,
          },
        },
        { upsert: true, new: true }
      );

      callback({ roomId: roomName, data: data });
    } catch (error) {
      console.error("Error finding users: ", error);
      callback({ roomId: roomName, data: [], error: "Error finding users" });
    }
  });

  // Join room for one user
  socket.on(
    SOCKET_EVENTS.JOIN_ROOM,
    async (sendersId, receiverId, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }

      const roomName = createRoomName(sendersId, receiverId);

      socket.join(roomName);

      let usersArr = [];
      const sender = await userModel.findOne({ _id: sendersId }).lean();

      const data = await roomModel.findOneAndUpdate(
        { roomName: roomName, user: sender._id },
        {
          $set: {
            roomName: roomName,
            user: sender._id,
          },
        },
        { upsert: true, new: true }
      );

      callback({ roomId: roomName, data: data });
    }
  );

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (senderId, roomId, messageContent, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }
      try {
        const messageSent = await messagesModel.create({
          sendersId: senderId,
          roomId: roomId,
          messageContent: messageContent,
        });

        socket.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageSent);
        socket.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, messageSent);

        callback({ messageSent });
      } catch (e) {
        console.log(e);
      }
    }
  );

  //   On disconnection
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("User disconnected with id : ", socket.id);
  });
};

module.exports = { events };
