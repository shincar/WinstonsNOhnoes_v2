$(function() {
  const var CONST_GAME_NAME = 'game';
  var username;
  var connected = false;

  var socket = io();

  // Implement Client function here
  const addUser = function(username) {
    socket.emit(CONST_GAME_NAME + ' add user', username);
  };

  const joinFightroom = function(username, fightroomname) {
    socket.emit(CONST_GAME_NAME + ' join fightroom', username, fightroom);
  };

  const sendFightMove = function(username, grid, token) {
    socket.emit(CONST_GAME_NAME + ' fight move', username, grid, token);
  }

  // Handle server events there
  socket.on(CONST_GAME_NAME + ' add user result', (result, message) => {
    if(result) {
      // username accepted
      // go to another scene
    } else {
      // error, maybe the username already exist
      // do something here
    }
  });

  socket.on(CONST_GAME_NAME + ' join fightroom result', (result, message) => {
    if(result) {

    } else {

    }
  });

  socket.on(CONST_GAME_NAME + ' fight start', (firstplayer) => {

  });

  socket.on(CONST_GAME_NAME + ' fight change', (username, grid, token) => {

  });

  socket.on(CONST_GAME_NAME + ' fight end', (winner) => {

  });
}
