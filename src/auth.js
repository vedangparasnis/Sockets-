const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const moment = require("moment");
const router = express.Router();

const passprt = require("passport");
const setup = require("./passport/passport");

module.exports.auth = (req, res, next) => {};

router.get("/", (req, res) => {
  res.render("auth.hbs", {
    date: moment().weekday(),
    time: moment().calendar()
  });
});

// strategy set up in authenticate
// callback function fired after exchange of the code form the valid token request

router.get(
  "/auth/google",
  passprt.authenticate("google", {
    scope: ["profile"]
  })
);

router.get(
  "/chat/dataGoogle",
  // fire the passport callback
  passprt.authenticate("google"),
  (req, res) => {
    res.send("callback url");
  }
);

router.get(
  "/auth/facebook",
  passprt.authenticate("facebook", {
    scope: ["email"],
    failureRedirect: "/",
    successRedirect: "/chat"
  })
);

router.get(
  "/chat/dataFacebook",
  passprt.authenticate("facebook"),
  (req, res) => {
    res.send("callback url");
  }
);

module.exports = router;
