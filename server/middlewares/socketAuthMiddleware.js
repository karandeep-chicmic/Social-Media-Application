const jwt = require("jsonwebtoken");

const socketAuth = (token) => {
  if (token) {
    jwt.verify(
      token,
      "537f5ede884e9d34bb82f7c54c5c7dd0e9fcbe533584fcefe69df5231bd02e453bdbcd264c6bcebfaa31a97553ff3723d87d629a9821a07f82799253edb94a5f",
      (err, data) => {
        if (err) {
          return false;
        } else {
          console.log("Token Verified through middleware in socket");
          return true;
        }
      }
    );
  } else {
    return false;
  }
};

module.exports = { socketAuth };