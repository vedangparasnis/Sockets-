const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const moment = require("moment");
const router = express.Router();

module.exports.auth = (req, res, next) => {};

router.get("/", (req, res) => {
  res.render("auth.hbs", {
    date: moment().weekday(),
    time: moment().calendar()
  });
});

module.exports = router;
