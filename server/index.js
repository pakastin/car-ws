const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(80);

io.on('connection', (socket) => {
  const { id } = socket;

  const origin = socket.request.headers.referer || socket.request.headers.origin || '';

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
      isThrottling,
      isReversing,
      isTurningLeft,
      isTurningRight
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
        isThrottling,
        isReversing,
        isTurningLeft,
        isTurningRight,
        ghost: !~origin.indexOf('pakastin.github.io')
      }
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
