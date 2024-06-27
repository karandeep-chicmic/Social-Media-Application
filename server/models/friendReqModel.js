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
    versionKey: false,
  }
);

const friendsModel = mongoose.model("friends", friendReqSchema, "friends");

module.exports = friendsModel;
