const socket = io();

const btn_chat = document.querySelector("form");
const msgs = document.querySelector("#user_msg");
const bode = document.getElementById("chats_body");
const locations = document.getElementById("share");

msgs.className = "list-group";

// location  goes here

locations.addEventListener("click", e => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("you cannot do that");
  } else {
    // get location using geoposition api
    locations.classList.add("disabled");
    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude }
      } = position;
      socket.emit("location_user", { latitude, longitude }, msgst => {
        // wait for callback
        console.log("received");
      });
    });
  }
});

// only the broadcasting user is not know in broadcasst emit

socket.on("welcome", msg => {
  console.log("user added" + msg.message + "at" + msg.createdAt);
  alert("a new user just entered");
  document.querySelector(
    "#make"
  ).innerHTML = `<span classname="text-danger" role="alert">${msg.message}</span>`;
});

socket.on("body", data => {
  locations.classList.remove("disabled");
  const div = document.createElement("div");
  const btn = document.createElement("button");
  btn.className = "btn btn-outline-info float-right";
  btn.id = "location_map";
  btn.innerHTML = `<a classname="alert alert-secondary" target="_blank" href=http://www.google.com/maps?q=${data.latitude},${data.longitude}>Locate me...</a>`;

  div.append(btn);
  div.append(
    document.createTextNode(
      `location shared latitude ${data.loc.latitude} longitude  ${data.loc.longitude}`
    )
  );
  div.className = "list-group-item  text-secondary bg-dark";
  let span = createtimestamp();
  span.textContent = data.val.time;

  div.appendChild(span);
  msgs.appendChild(div);
});

function createtimestamp() {
  const span = document.createElement("span");
  span.className = "badge badge-info float-right";
  return span;
}

function addmsgtoDom(str, type) {
  const divs = document.createElement("div");
  divs.append(document.createTextNode(str));
  divs.className = "list-group-item";

  let span = createtimestamp();
  span.textContent = type.time;

  divs.appendChild(span);
  msgs.appendChild(divs);
}

socket.on("user_msgs", msg => {
  // addd to dom
  addmsgtoDom(`new User msg ${msg.inp}`, msg);
});

btn_chat.addEventListener("submit", e => {
  e.preventDefault();
  const inp = document.querySelector("#user_message").value;
  if (inp == "bye" || "Bye") {
    socket.on("disconnect", () => {
      console.log("emit the user method");
    });
  }
  if (inp.length == 0) {
    alert("please type a message first");
  } else {
    // emit user message on to the server
    socket.emit("user_msg", inp, msg => {
      // add to dom
      if (msg == "Language is harsh") {
        alert(msg);
      } else {
        // adding time to dom
        console.log("msg received");
      }
    });
  }
  document.querySelector("input").value = " ";
});

socket.on("message", ({ message, createdAt }) => {
  console.log(message, createdAt);
  alert(message);
});

window.addEventListener("scroll", e => {
  console.log(e);
  bode.className = "fixed-top position-relative float-left";
});
