const { Schema, model } = require("mongoose");

const loggerSchema = new Schema(
  {
    action: { type: String, required: true },
    message: { type: String, required: true },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const loggerModel = model("logger", loggerSchema, "logger");

module.exports = { loggerModel };
