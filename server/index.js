const { NODE_PORT } = process.env;

const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://car.js.org',
    credentials: true
  }
});

server.listen(NODE_PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Listening port ${NODE_PORT}`);
});

io.on('connection', (socket) => {
  const { id } = socket;

  socket.broadcast.emit('join');

  socket.on('params', (params) => {
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
      points
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
      name,
      points
    };

    if (isHit || isShot) {
      newParams.x = Math.round(Math.random() * 1500);
      newParams.y = Math.round(Math.random() * 1500);
      newParams.isHit = false;
      newParams.isShot = false;
    }

    socket.broadcast.emit('params', {
      id,
      params: newParams
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
