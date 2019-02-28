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
  res.sendFile(path.join(__dirname, '/public/game.html'));
});

app.get('/chat', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/chat.html'));
})

var numUsers = 0;

var Player = function(username, fightroomname) {
  this.name = username;
  this.fightroomname = fightroomname;
};

var Move = function(playername, token, grid) {
  this.playername = playername;
  this.token = token;
  this.grid = grid;
}

var Fightroom = function(fightroomname) {
  this.name = fightroomname;
  this.maxPlayerCount = 2;
  this.currentPlayers = [];
  this.currentPlayer;
  this.moves = [];
  this.winner;
}

var playerList = [];
var fightroomList = [];

io.on('connection', (socket) => {
  var addedUser = false;

  socket.on('game join fightroom', (username, fightroomname) => {
    console.log('A user: [' + username + '] tried to join fightroom[' + fightroomname + ']');

    // [TODO] Add some fightroom info check here
    var fightroom = fightroomList.find(function(room) {
      return (room.name === fightroomname);
    });

    if(fightroom) {
      // let user join existing fightroom
      var player2 = new Player(username, fightroomname);
      fightroom.currentPlayers.push(player2);
      playerList.push(player2);
      console.log('Fightroom[' + fightroomname + '] exist. Player2[' + username + '] joined');
      socket.join(fightroomname);
      // fightroom is full, notify players in the fightroom to start

      io.in(fightroomname).emit('fight start', fightroom);

    } else {
      // if there is no fightroomname exist, create one
      fightroom = new Fightroom(fightroomname);
      var player1 = new Player(username, fightroomname);
      playerList.push(player1);
      fightroom.currentPlayers.push(player1);
      fightroom.currentPlayer = player1;
      fightroomList.push(fightroom);
      console.log('New fightroom[' + fightroomname + '] created. Player1[' + username + '] joined');
      socket.join(fightroomname);
    }
  });

  socket.on('fight change', (fightroom, username, token_index, grid_index) => {
    console.log('A user: [' + username + '] performed a move(' + token_index + ', ' + grid_index + ')');
    fightroom.moves.push(new Move(username, token_index, grid_index));
    socket.to(fightroom.name).emit('fight change', fightroom, username, token_index, grid_index);
  });

  socket.on('fight end', (fightroom, winner, playername) => {
    console.log('Game[' + fightroom.name + '] end, winner: ' + winner);
    socket.leave(fightroom.name);

    var playerIndex = playerList.findIndex(function(p) {
      return (p.name === playername && p.fightroomname == fightroom.name);
    });

    if(playerIndex >= 0) {
        console.log('Remove player from player list: ' + playerList.length);
        playerList.splice(playerIndex, 1);
        console.log('Player removed. ' + playerList.length);
    }

    var fightroomIndex = fightroomList.findIndex(function(room) {
      return (room.name === fightroom.name);
    });

    if(fightroomIndex >= 0) {
        console.log('Game ended, remove fightroom from fightroom list: ' + fightroomList.length);
        fightroomList.splice(fightroomIndex, 1);
        console.log('Fightroom removed. ' + fightroomList.length);
    }
  });

  socket.on('game cancel fightroom', (username, fightroomname) => {
    console.log('A user: [' + username + '] left fightroom[' + fightroomname + ']');
    socket.leave(fightroomname);
    var playerIndex = playerList.findIndex(function(p) {
      return (p.name === username && p.fightroomname == fightroomname);
    });

    if(playerIndex >= 0) {
        console.log('Remove player from player list: ' + playerList.length);
        playerList.splice(playerIndex, 1);
        console.log('Player removed. ' + playerList.length);
    }

    var fightroomIndex = fightroomList.findIndex(function(room) {
      return (room.name === fightroomname);
    });

    if(fightroomIndex >= 0) {
        console.log('Remove fightroom from fightroom list: ' + fightroomList.length);
        fightroomList.splice(fightroomIndex, 1);
        console.log('Fightroom removed. ' + fightroomList.length);
    }
  });

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
