const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constants");

const socketAuth = () => {
  return (socket, next) => {
    const { token } = socket.handshake.auth;

    if (token) {
      jwt.verify(token, SECRET_KEY, (err, data) => {
        if (err) {
          throw err;
        } else {
          console.log("Token Verified through middleware in socket !!");
          next();
        }
      });
    } else {
      throw new Error("Token is not even generated !!");
    }
  };
};

module.exports = { socketAuth };
