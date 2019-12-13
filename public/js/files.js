const uuid = require("uuid");
const moment = require("moment");
module.exports.getName = user_msg => {
  return {
    message: user_msg,
    createdAt: Date.now()
  };
};

module.exports.time = inp => {
  return {
    inp,
    time: moment().calendar()
  };
};

module.exports.keys = { value: "user_secret" };
