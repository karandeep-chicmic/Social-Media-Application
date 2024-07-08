const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const { validate } = require("./validateMiddleware");
const { routes } = require("../routes");
const { authorizeUser } = require("./authMiddleware");
const { Server } = require("socket.io");
const { events } = require("../events/chatEvents");
const { socketAuth } = require("./socketAuthMiddleware");
const { loggerModel } = require("../models/loggerModel");

const {
  CORS_ORIGIN,
  SOCKET_EVENTS,
  CHAT_NAMESPACES,
} = require("../utils/constants");

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
      .then(async (result) => {
        await loggerModel.create({
          action: result.statusCode,
          message: result.data.message ? result.data.message : "success",
        });
        res.status(result.statusCode).json(result.data);
      })
      .catch(async (err) => {
        await loggerModel.create({
          action: err.statusCode ? err.statusCode : 500,
          message: err.data ? result.data : "ERROR",
        });
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
      origin: CORS_ORIGIN,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  const chatNamespace = io.of(CHAT_NAMESPACES.CHAT);

  // middlewares

  chatNamespace.use(socketAuth());
  chatNamespace.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
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
