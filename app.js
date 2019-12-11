const http = require("http");
const socket = require("socket.io");

const express = require("express");
const path = require("path");
const hbs = require("hbs");
const event = require("events");
const uuid = require("uuid");
const cors = require("cors");

// time
const dayjs = require("dayjs");
const reltime = require("dayjs/plugin/relativeTime");
const bwd = require("bad-words");

const app = express();
const server = http.createServer(app);
// raw http server used by express
const io = socket(server);

const { getName } = require("./public/js/files");
const { auth } = require("./middleware");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./templates"));
app.use(express.static(path.join(__dirname, "./public")));
app.use("/", require("./auth"));
app.use(cors());

app.get("/chat", auth, (req, res) => {
  if (req.user) {
    res.render("chat", {
      user: "mat dowrie"
    });
  }
});

app.get("/*", (req, res) => {
  res.status(404).json({ err: "file not on server" });
});

io.on("connection", socket => {
  socket.emit("welcome", getName("hello welcome there user"));

  socket.on("user_msg", (inp, cb) => {
    // successfully receiving the message
    const fileter = new bwd();

    if (fileter.isProfane(inp)) {
      return cb("Language is harsh");
    } else {
      io.emit("user_msgs", inp);
      let val = dayjs.extend(reltime);
      cb(dayjs(Date.now()).fromNow());
    }
  });

  socket.on("disconnect", () => {
    io.emit("message", getName("user left"));
  });

  // receive location
  socket.on("location_user", (loc, cb) => {
    // handle the server side response to client request for ack
    setTimeout(() => {
      io.emit("body", loc);
      cb("message shared with all");
    }, 1500);
  });
});

// leave the user msg
server.listen(3000);
