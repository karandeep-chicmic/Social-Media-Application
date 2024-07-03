const { Schema, model, default: mongoose } = require("mongoose");

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const groupModel = model("groups", groupSchema, "groups");

module.exports = { groupModel };
