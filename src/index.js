var io = require('socket.io')();
var players = require('./players');
var lobbies = require('./lobbies');

io.on('connection', (socket) => {
    console.log();
    console.log('client connected');
    console.log('socket.id:', socket.id);

    socket.on('disconnect', reason => {
        console.log('client disconnected:', reason);
        players.delete(socket.id);
    });

    socket.on('player:register', data => players.update(socket.id, data));
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
