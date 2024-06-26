const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    username: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, default: "user" },

    profilePicture: { type: String, default: "" },

    coverPicture: { type: String, default: "" },

    privacy: { type: Boolean, default: true },

    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = mongoose.model("users", userSchema, "users");

module.exports = { userModel };
