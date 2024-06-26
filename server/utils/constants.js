const PORT = 3400;

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
  FRIEND_REQUEST_SENT: "Friend Request Sent !!",
  FRIEND_REQUEST_ACCEPTED: "Friend Request Accepted !!"
};

const BCRYPT = {
  SALT_ROUNDS: 10,
};

const SECRET_KEY =
  "537f5ede884e9d34bb82f7c54c5c7dd0e9fcbe533584fcefe69df5231bd02e453bdbcd264c6bcebfaa31a97553ff3723d87d629a9821a07f82799253edb94a5f";

module.exports = { PORT, RESPONSE_MSGS, BCRYPT, SECRET_KEY };
