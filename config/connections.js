module.exports = function(io) {
  // API ==========================================================================
  [
    'emojis'
  ].forEach(function (connectionName) {
      require('app/connections/' + connectionName)(io);
  });
  io.sockets.on('connection', function(socket) {
  	socket.emit('init', {
	    message: 'Successfully connected.'
	  });
  });
};
