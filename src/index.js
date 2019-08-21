var io = require('socket.io')();
var _ = require('underscore');

var players = require('./players');
var lobbies = require('./lobbies');

const port = 8000;

io.on('connection', socket => {
    console.log();
    console.log('Client connected');
    console.log('Socket ID:', socket.id);

    socket.on('disconnect', reason => players.disconnect(socket.id, reason));

    socket.on('player:create', data => players.create(socket.id, data));
    socket.on('player:update', data => players.update(socket.id, data));
});

io.listen(port);
console.log('Listening on port', port);
