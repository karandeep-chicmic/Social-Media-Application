const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constants");

const authorizeUser = () => {
  return (req, res, next) => {
    console.log("inside Authorize");

    const { token } = req.headers;

    if (token) {
      jwt.verify(
        token,
        SECRET_KEY,
        (err, data) => {
          if (err) {
            throw err;
          } else {
            req.userId = data.id;

            console.log("Token Verified through middleware");
            next();
          }
        }
      );
    } else {
      throw new Error("Token is not even generated !!");
    }
  };
};

module.exports = { authorizeUser };
