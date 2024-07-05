const { Schema, model, default: mongoose } = require("mongoose");

const socketsSchema = new Schema(
  {
    socketId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 10,
    },
  },
  {
    versionKey: false,
  }
);

const socketsModel = model("sockets", socketsSchema, "sockets");

module.exports = { socketsModel };
