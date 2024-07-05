const mongoose = require("mongoose");
const { MONGO_CONNECTION_STRING } = require("../utils/constants");

const mongoConnection = async () => {
  mongoose.connect(MONGO_CONNECTION_STRING, {});
  mongoose.connection.on("connected", () => {
    console.log("MongoDb is successfully Connected!!");
  });
  mongoose.connection.on("error", (err) => {
    console.log(`mongoDb not connected due to error ${err}`);
  });
};

module.exports = mongoConnection;
