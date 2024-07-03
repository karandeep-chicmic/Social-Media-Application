const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    imageOrVideo: {
      type: String,
      default: "",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    taggedPeople: {
      type: Array,
      default: [],
    },
    userUploaded: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    shares: {
      type: Number,
      default: 0,
    },
    showOnProfile: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const postsModel = mongoose.model("posts", postSchema, "posts");

module.exports = { postsModel };
