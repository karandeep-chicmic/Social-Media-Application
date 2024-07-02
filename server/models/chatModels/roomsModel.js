const { Schema, model, default: mongoose } = require("mongoose");

const roomsSchema = new Schema(
  {
    roomName: {
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

const roomModel = model("rooms", roomsSchema, "rooms");

module.exports = { roomModel };
