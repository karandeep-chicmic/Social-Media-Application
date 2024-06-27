const { Schema, model } = require("mongoose");

const likesSchema = new Schema({
  userLiked: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
});

const likesModel = model("likes", likesSchema, "likes");

module.exports = { likesModel };
