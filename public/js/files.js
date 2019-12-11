const uuid = require("uuid");
module.exports.getName = user_msg => {
  return {
    message: user_msg,
    createdAt: Date.now()
  };
};
