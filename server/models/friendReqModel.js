const mongoose = require("mongoose");

const friendReqSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reqAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const friendReqModel = mongoose.model("friendReqs", friendReqSchema, "friendReqs");

module.exports = friendReqModel;
