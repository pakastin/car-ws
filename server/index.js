const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(80);

io.on('connection', (socket) => {
  const { id } = socket;

  socket.on('params', (params) => {
    socket.broadcast.emit('params', {
      id,
      params
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
