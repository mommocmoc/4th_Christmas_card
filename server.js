var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var userNameList = {};
var userCounter = 0;
var data = {
  userNum: userCounter,
  userNameList: "No one"
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {


  console.log(`${socket.id} connected`);
  //user가 닉네임 입력하면 실행
  socket.on('add user', (userName) => {
    ++userCounter;
    socket.userName = userName;
    userNameList[socket.id] = userName
    let userNameString = Object.values(userNameList).toString();
    data.userNum = userCounter;
    data.userNameList = userNameString;
    //Event Handler    
    socket.emit('user added', data)
    socket.broadcast.emit('new user added', data);
    //Console
    console.log(data);
    console.log(`${userCounter} is here`);
    console.log(`${socket.userName} joined :)`);
    console.log(userNameString);
  })

  // user가 접속 해제하면 실행
  socket.on('disconnect', () => {
    if (socket.userName === undefined) return;
    --userCounter;
    if (userCounter < 0) {
      userCounter = 0
    }
    delete userNameList[socket.id]
    let userNameString = Object.values(userNameList).toString();
    data.userNum = userCounter;
    socket.broadcast.emit('user left', data)
    //Console
    console.log(`${userCounter} is here`);
    console.log(data);
    console.log(`${socket.userName} disconnected`);
    console.log(userNameList);
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});