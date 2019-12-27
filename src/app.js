const http = require("http");
const socket = require("socket.io");

const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const firebase = require("firebase");
const cookie = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// time
const bwd = require("bad-words");

const app = express();
const server = http.createServer(app);
// raw http server used by express
const io = socket(server);

const { getName } = require("../public/js/files");
const { time } = require("../public/js/files");
const { config } = require("../configs/firebase");
const {
  keys: { value }
} = require("../public/js/files");
// init firebase
firebase.initializeApp(config);

app.use(
  cookie({
    maxAge: 24 * 60 * 60 * 1000 * 5,
    // encryption the cookie`
    keys: [value]
  })
);
// init passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", require("./auth"));
app.use("/custom", require("./auth/jwt_auth"));
app.use(cors());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

io.on("connection", socket => {
  socket.broadcast.emit("welcome", getName("a new user has just joined"));
  socket.on("user_msg", (inp, cb) => {
    // successfully receiving the message
    const fileter = new bwd();

    if (fileter.isProfane(inp)) {
      return cb("Language is harsh");
    } else {
      io.emit("user_msgs", time(inp));
      cb(time());
    }
  });

  socket.on("disconnect", () => {
    io.emit("message", getName("user left"));
  });

  // receive location
  socket.on("location_user", (loc, cb) => {
    // handle the server side response to client request for ack
    setTimeout(() => {
      io.emit("body", { loc, val: time() });
      cb(time("message location all shared"));
    }, 1500);
  });
});
app.get("/*", (req, res) => {
  res.status(404).json({ err: "file not on server" });
});

app.post("/", urlencodedParser, (req, res) => {
  const { username, password } = req.body;
  firebase
    .firestore()
    .doc(`/customs/${username}`)
    .get()
    .then(data => {
      if (data.exists) {
        bcrypt
          .compare(password, data.data().password)
          .then(has => {
            if (has) {
              const user_data = { displayName: data.data().username };
              req.user_name = user_data;
              res.redirect("/chat");
            } else {
              res.render("auth.hbs", { errormsg: "Password did not matched" });
            }
          })
          .catch(err => {
            console.log("password dindnt matched");
          });
      } else {
        res.redirect("/custom/register");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// leave the user msg
server.listen(3000, server => {
  console.log("server running");
});
