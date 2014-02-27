module.exports = function(io) {
  // API ==========================================================================
  [
    'emojis'
  ].forEach(function (connectionName) {
      require('app/connections/' + connectionName)(io);
  });
};
