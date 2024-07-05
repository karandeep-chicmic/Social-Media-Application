const { messagesModel } = require("../models/chatModels/messagesModel");
const { roomModel } = require("../models/chatModels/roomsModel");
const { SOCKET_EVENTS, RESPONSE_MSGS } = require("../utils/constants");
const { userModel } = require("../models/userModel");
const { socketsModel } = require("../models/chatModels/socketsModel");

// Creating a room name for user
const createRoomName = (senderId, receiverId) => {
  return [senderId, receiverId].sort().join("-");
};

const events = async (socket, io) => {
  console.log("New user connected to chat with id : ", socket.id);

  // io.use(socketAuth);
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

      let data = await roomModel.findOne({ roomName: roomName, user: userId });

      if (data) {
        // Update the existing document if it exists
        data = await roomModel.findOneAndUpdate(
          { roomName: roomName, user: userId },
          {
            $set: {
              roomName: roomName,
              user: userId,
            },
          },
          { new: true }
        );
      } else {
        // Create a new document if it doesn't exist
        data = await roomModel.create({ roomName: roomName, user: userId });
      }

      callback({ roomId: roomName, data: data });
    } catch (error) {
      console.error("Error finding or updating users: ", error);
      callback({
        roomId: roomName,
        data: [],
        error: "Error finding or updating users",
      });
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
  socket.on(SOCKET_EVENTS.JOIN_ROOMS_ALL, async (userId, callback) => {
    if (typeof callback !== "function") {
      console.error("Callback is not a function");
      return;
    }
    try {
      const allRooms = await roomModel.find({ user: userId });

      allRooms.forEach((data) => {
        socket.join(data.roomName);
      });

      callback({
        message: RESPONSE_MSGS.JOINED_ALL,
      });
    } catch (error) {
      callback({ error });
      console.log("ERROR is:", error);
    }
  });

  // Notifications emit
  socket.on(
    SOCKET_EVENTS.SEND_REQ_NOTIFICATION,
    async (friendId, userId, accept, callback) => {
      if (typeof callback !== "function") {
        console.error("Callback is not a function");
        return;
      }

      // Fetch the socket information for the friend
      const findSocket = await socketsModel.find({ user: friendId });

      // Fetch the user information for the sender
      const userFind = await userModel.find({ _id: userId });

      if (findSocket.length > 0 && userFind.length > 0) {
        // Emit the notification to each socket ID of the friend
        findSocket.forEach((data) => {
          socket.to(data.socketId).emit(SOCKET_EVENTS.RECEIVE_FRIEND_REQ, {
            username: userFind[0].username,
            accept: accept,
          });
        });
        // callback with a success message
        callback({ message: RESPONSE_MSGS.SENT_NOTIFICATION });
      } else {
        callback({ message: RESPONSE_MSGS.FAILURE });
      }
    }
  );

  //   On disconnection
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("User disconnected with id : ", socket.id);
  });
};

module.exports = { events };
