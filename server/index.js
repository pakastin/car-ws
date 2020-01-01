const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(80);

io.on('connection', (socket) => {
  const { id } = socket;

  const origin = socket.request.headers.referer || socket.request.headers.origin || '';

  socket.broadcast.emit('join');

  socket.on('params', (params) => {
    if (~origin.indexOf('pakastin.github.io')) {
      socket.broadcast.emit('params', {
        id,
        params
      });
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
