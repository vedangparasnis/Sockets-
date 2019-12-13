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

module.exports.client = {
  clientID:
    "238359094877-5prbon5hm0ieq32uismcc9vo570vpl2a.apps.googleusercontent.com",
  clientSecret: "kA9U7CHbel-27ajP_LX0QJah"
};

module.exports.facebook = {
  clientID: 2626834230879797,
  clientSecret: "468a869bde02931426ffd0a8c9400e08"
};

module.exports.keys = { value: "user_secret" };
