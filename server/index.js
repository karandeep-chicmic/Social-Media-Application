const mongoose = require("mongoose");
const express = require("express");
const app = express();


const { PORT } = require("./utils/constants");
const startExpressApplication = require("./middlewares/startExpressMiddleware");

mongoose.connect("mongodb://localhost:27017/socialMedia", {});

mongoose.connection.on("connected", () => {
  console.log("MongoDb is successfully Connected!!");
});
mongoose.connection.on("error", (err) => {
  console.log(`mongoDb not connected due to error ${err}`);
});

const startApplication = async () => {
  await startExpressApplication(app);
};

app.get("/", () => {
  console.log("Hello World");
});

startApplication()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error in starting server ${err}`);
  });
