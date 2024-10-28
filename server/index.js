const { NODE_PORT } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://car.js.org",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "https://car.js.org",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/ping", (req, res, next) => {
  res.send("pong");
});

server.listen(NODE_PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Listening port ${NODE_PORT}`);
});

io.on("connection", (socket) => {
  const { id } = socket;

  socket.broadcast.emit("join");

  socket.on("params", (params) => {
    const {
      x,
      y,
      xVelocity,
      yVelocity,
      power,
      reverse,
      angle,
      angularVelocity,
      isTurningLeft,
      isTurningRight,
      isThrottling,
      isReversing,
      isHit,
      isShot,
      isShooting,
      lastShootAt,
      name,
      points,
    } = params;

    const newParams = {
      x,
      y,
      xVelocity,
      yVelocity,
      power,
      reverse,
      angle,
      angularVelocity,
      isTurningLeft,
      isTurningRight,
      isThrottling,
      isReversing,
      isHit,
      isShot,
      isShooting,
      lastShootAt,
      name: restrictName(name || ""),
      points,
    };

    if (isHit || isShot) {
      newParams.x = Math.round(Math.random() * 1500);
      newParams.y = Math.round(Math.random() * 1500);
      newParams.isHit = false;
      newParams.isShot = false;
    }

    socket.broadcast.emit("params", {
      id,
      params: newParams,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", id);
  });
});

function restrictName(name) {
  if (name.length > 15) {
    return `${name.slice(0, 15)}...`;
  } else {
    return name;
  }
}
