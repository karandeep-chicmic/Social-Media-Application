const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { PORT } = require("./utils/constants");
const startExpressApplication = require("./middlewares/startExpressMiddleware");
const mongoConnection = require("./middlewares/mongoMiddleware");


const startApplication = async () => {
  await mongoConnection();
  await startExpressApplication(app, server);
};

startApplication()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error in starting server ${err}`);
  });
