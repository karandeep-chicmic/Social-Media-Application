const PORT = 3400;

const RESPONSE_MSGS = {
  SUCCESS: "Operation Successful",
  FAILURE: "Operation Failed",
  USER_EXIST: "User Already Exist",
  USER_NOT_EXIST: "User Does Not Exist",
  INVALID_CREDENTIALS: "Invalid Credentials",
  INTERNAL_SERVER_ERR: "Internal Server Error!!",
  NO_TASK_LIST: "No task list for user",
  NO_TASK_ASSOCIATED_WITH_ID: "Cant find task associated with id",
  TASK_NAME_REQUIRED_FIELD: "taskName is a required field",
  FILL_FIELDS_CORRECTlY: "Please fill all fields correctly",
  WRONG_PASSWORD: "Wrong Password try again",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully !!",
  NO_MESSAGES: "No Message found!!",
  NO_ROOMS_FOUND: "Cannot Find room for the user !!",
  VERIFY_EMAIL: "Please Verify Email!!",
};

const BCRYPT = {
  SALT_ROUNDS: 10,
};

module.exports = { PORT, RESPONSE_MSGS , BCRYPT};
