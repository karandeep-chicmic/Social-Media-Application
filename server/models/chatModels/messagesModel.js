const { Schema, model, default: mongoose } = require("mongoose");

const messagesSchema = new Schema(
  {
    sendersId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    roomId: {
      type: String,
      required: true,
    },
    messageContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const messagesModel = model("messages", messagesSchema, "messages");
module.exports = { messagesModel };
