const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports.auth = (req, res, next) => {};

router.get("/", (req, res) => {
  res.render("auth.hbs", {
    date: Date.now()
  });
});

module.exports = router;
