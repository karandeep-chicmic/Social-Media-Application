const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const { validate } = require("./validateMiddleware");
const { routes } = require("../routes");
const { authorizeUser } = require("./authMiddleware");
const { Server } = require("socket.io");
const { events } = require("../events/chatEvents");

const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const handlers = (route) => {
  return (req, res) => {
    let payload = {
      ...(req.body || {}),
      ...(req.query || {}),
      ...(req.params || {}),
      userId: req.userId,
      file: req.file,
    };

    route
      .controller(payload)
      .then((result) => {
        res.status(result.statusCode).json(result.data);
      })
      .catch((err) => {
        if (err?.statusCode) {
          res.status(err?.statusCode).json(err.message);
        }
        res.status(500).json(err.message);
      });
  };
};
const uploads = multer({ storage: storage });

const startExpressApplication = async (app, server) => {
  app.use(express.json());
  app.use(cors());
  app.use("/public", express.static("public"));

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.of("/chat").on("connection", async (socket) => {
    await events(socket, io);
  });

  routes.forEach((data) => {
    let middlewares = [];
    if (data.auth) {
      middlewares.push(authorizeUser());
    }
    if (data.file) {
      middlewares.push(uploads.single("file"));
    }
    if (data.schema) {
      middlewares.push(validate(data.schema));
    }

    app
      .route(data.path)
      [data.method.toLowerCase()](...middlewares, handlers(data));
  });
};

module.exports = startExpressApplication;
