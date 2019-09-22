const io = require('socket.io')();
const _ = require('underscore');
const chalk = require('chalk');

const port = 8000;

const Player = require('./player');
const Lobby = require('./lobby');

const lobbies = new Lobbies();

io.on('connection', socket => {
    const on = (event, func) => socket.on(event, (data, callback) => {
        const obj = _.isFunction(func) ? func(socket.id, data) :  null;
        if(_.isFunction(callback)) callback(obj);
    });

    const emit = (event, data) => socket.emit(event, data);

    const notifyStateChange = (notifier, lobby) => {
        if(!lobby) lobby = lobbies.exitLobby(notifier);
        if(!lobby) return;

        lobby.forAllPlayers((id, player) => {
            if(id === notifier) return;
            io.to(`${id}`).emit('game:state', lobby);
        });
    }

    console.log();
    console.log(chalk.green.bold('Player connected\nPlayer ID:', socket.id));

    on('disconnect', (id, reason) => {
        console.log(chalk.red.bold(`Player disconnected, reason: ${reason}\nPlayer ID: ${id}`));

        notifyStateChange(id);
    });

    on('game:create', (id, data) => {
        notifyStateChange(id);

        return lobbies.createLobby(id, data.player, data.lobby);
    });

    on('game:join', (id, data) => {
        notifyStateChange(id);

        let lobby = lobbies.joinLobby(id, data.player, data.lobby);
        if(lobby) {
            notifyStateChange(id, lobby);
            return lobby;
        }

        return {
            error: {
                message: 'Lobby code or password is incorrect'
            }
        }
    });
});

io.listen(port);
console.log('Listening on port', port);
