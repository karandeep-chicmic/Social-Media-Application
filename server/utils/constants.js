const PORT = 3400;

const CHAT_NAMESPACES = {
  CHAT: "/chat",
};

const RESPONSE_MSGS = {
  SUCCESS: "Operation Successful !!",
  FAILURE: "Operation Failed !!",
  USER_EXIST: "User Already Exist !!",
  USER_NOT_EXIST: "User Does Not Exist !!",
  INVALID_CREDENTIALS: "Invalid Credentials !!",
  INTERNAL_SERVER_ERR: "Internal Server Error !!",
  NO_TASK_LIST: "No task list for user !!",
  NO_TASK_ASSOCIATED_WITH_ID: "Cant find task associated with id !!",
  TASK_NAME_REQUIRED_FIELD: "taskName is a required field !!",
  FILL_FIELDS_CORRECTlY: "Please fill all fields correctly !!",
  WRONG_PASSWORD: "Wrong Password try again !!",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully !!",
  NO_MESSAGES: "No Message found !!",
  NO_ROOMS_FOUND: "Cannot Find room for the user !!",
  VERIFY_EMAIL: "Please Verify Email !!",
  ALREADY_VERIFIED: "User is already verified !!",
  CREATE_USER: "First Create user !!",
  GENERATE_OTP_FIRST: "You need to generate the otp first !!",
  OTP_VERIFIED_SUCCESSFULLY: "OTP is verified Successfully !!",
  INVALID_OTP: "Invalid Otp, Try Again !!",
  FAILED_TO_POST: "Failed to post !!",
  POST_NOT_FOUND: " Cant Find the Post !!",
  NOT_FRIENDS: "Users are Not Friends !!",
  FRIENDS: "Users are friends !!",
  FRIEND_REQUEST_SENT: "Friend Request Sent !!",
  FRIEND_REQUEST_ACCEPTED: "Friend Request Accepted !!",
  NO_POSTS: "No Posts for User !!",
  ALREADY_LIKED: "You have already liked this post !!",
  LIKE_POST: "post liked successfully !!",
  NOT_FRIEND_AND_PRIVATE_ACC:
    "Users are not friends and the account is private !!",
  NOT_LIKED: "Post is already disliked !!",
  DISLIKE_POST: "Post successfully Disliked !!",
  FRIENDS_DELETED: "Friends are Removed !!",
  NO_FRIEND_REQUESTS: "No Friend requests !!",
  REQ_ALREADY_PRESENT: "Request Present for user !!",
  OLDPASS_DOESNT_MATCH: "Old Password does'nt match !!",
  JOINED_ALL: "Joined All Users And Groups!!",
  SOCKET_NOT_ADDED: "Socket Not Added !!",
  SENT_NOTIFICATION: "Notification Sent Successfully !!",
};

const BCRYPT = {
  SALT_ROUNDS: 10,
};

const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",
  GROUP_JOIN: "group-join",
  JOIN_BY_ROOM_NAME: "join-by-room-name",
  JOIN_ROOMS_ALL: "join-all-rooms",
  SEND_REQ_NOTIFICATION: "send-req-notification",
  RECEIVE_FRIEND_REQ: "request-notification",
  ACCEPT_REQ_NOTIFICATION: "accept-req-notification",
  ACCEPT_REQ: "accept-req",
};

const SECRET_KEY =
  "537f5ede884e9d34bb82f7c54c5c7dd0e9fcbe533584fcefe69df5231bd02e453bdbcd264c6bcebfaa31a97553ff3723d87d629a9821a07f82799253edb94a5f";

const MONGO_CONNECTION_STRING = "mongodb://localhost:27017/socialMedia";

const CORS_ORIGIN = "http://localhost:4200";

module.exports = {
  PORT,
  RESPONSE_MSGS,
  BCRYPT,
  SECRET_KEY,
  SOCKET_EVENTS,
  MONGO_CONNECTION_STRING,
  CORS_ORIGIN,
  CHAT_NAMESPACES,
};
