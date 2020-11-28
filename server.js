var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var userList = [];
var userCounter = 0;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  // userList.push(socket);
  ++userCounter;
  console.log(`${userCounter} is here`);
  socket.emit('user added', userCounter)
  socket.broadcast.emit('new user added', userCounter);
  socket.on('disconnect', () => {
    --userCounter;
    console.log(`${userCounter} is here`);
    socket.broadcast.emit('user left', userCounter)
    console.log(`${socket.id} disconnected`);

  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});