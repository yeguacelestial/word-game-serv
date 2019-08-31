const io = require('socket.io')();
const _ = require('underscore');
const chalk = require('chalk');

const lobbies = require('./lobbies');
const players = require('./players');

const port = 8000;

io.on('connection', client => {
    console.log();
    console.log(chalk.green.bold('Client connected\nClient ID:', client.id));

    const on = (event, func) => client.on(event, (data, callback) => {
        const obj = _.isFunction(func) ? func(client.id, data) :  null;
        if(_.isFunction(callback)) callback(obj);
    });

    on('disconnect', (id, reason) => {
        console.log(chalk.red.bold('Client disconnected, reason: ', reason, '\nClient ID:', id));
        players.deletePlayer(id);
    });

    on('player:create', players.createPlayer);
    on('player:update', players.updatePlayer);

    on('lobby:create', lobbies.createLobby);
});

io.listen(port);
console.log('Listening on port', port);
