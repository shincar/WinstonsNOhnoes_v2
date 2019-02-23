// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 30000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
//  console.log('SendFile: ' + path.join(__dirname, '/public/WinstonNOhnoes_Fullscreen.html'));
//  res.sendFile(path.join(__dirname, '/public/WinstonNOhnoes_Fullscreen.html'));
    res.send('Debug');
});

app.get('/chat', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/chat.html'));
})

var numUsers = 0;

var Player = function(username) {
  this.name = username;
  this.fightroomname;
};

var Move = function() {
  this.plyaername;
  this.grid;
  this.token;
}

var Fightroom = function() {
  this.name;
  this.maxPlayerCount = 2;
  this.currentPlayers;
  this.currentPlayer;
  this.moves = [];
  this.winner;
}

var playerList = [];
var fightroomList = [];

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
