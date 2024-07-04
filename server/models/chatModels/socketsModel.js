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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const socketsModel = model("sockets", socketsSchema, "sockets");

module.exports = { socketsModel };
