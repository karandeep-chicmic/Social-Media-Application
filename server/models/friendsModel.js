const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    friends: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const friendsModel = mongoose.model("friends", friendsSchema, "friends");

module.exports = friendsModel;
