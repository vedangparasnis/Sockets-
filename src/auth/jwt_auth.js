const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const firebase = require("firebase");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const {
  secrets: { clientSecret, saltRounds }
} = require("../../public/js/secrets");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/register", async (req, res) => {
  res.render("register.hbs");
});

router.post("/register", urlencodedParser, async (req, res) => {
  const { username, email, password } = req.body;
  const token = await jwt.sign({ email, username }, clientSecret);
  const hashed = await bcrypt.hash(password, saltRounds);
  firebase
    .firestore()
    .doc(`/customs/${username}`)
    .get()
    .then(data => {
      if (data.exists) {
        res.redirect("/");
      } else {
        const newData = { username, email, password: hashed, token };
        firebase
          .firestore()
          .doc(`/customs/${username}`)
          .set(newData)
          .then(msg => {
            console.log("new user registered");
            res.render("auth.hbs", {
              msg: "you can login from here"
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
