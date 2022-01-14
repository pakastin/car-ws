const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://car.js.org',
    methods: ['GET'],
    credentials: true
  }
});

server.listen(80);

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

    socket.broadcast.emit('params', {
      id,
      params: {
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
      }
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
