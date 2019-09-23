const io = require('socket.io')();
const _ = require('underscore');
const chalk = require('chalk');

const port = 8000;

const Lobbies = require('./lobbies');

const lobbies = new Lobbies();

io.on('connection', socket => {
    const on = (event, func) => socket.on(event, (data, callback) => {
        const obj = _.isFunction(func) ? func(socket.id, data) :  null;
        if(_.isFunction(callback)) callback(obj);
    });

    const emit = (event, data) => socket.emit(event, data);

    console.log();
    console.log(chalk.green.bold('Player connected\nPlayer ID:', socket.id));

    on('disconnect', (id, reason) => {
        console.log(chalk.red.bold(`Player disconnected, reason: ${reason}\nPlayer ID: ${id}`));

        let lobby = lobbies.removePlayerFromCurrentLobby(id);

        if(lobby)
            lobby.forAllPlayers(playerId => {
                io.to(`${playerId}`).emit('game:state', lobby);
            });
    });

    on('game:create', (id, data) => {
        if(!_.isObject(data)) return {
            error: {
                message: 'Lobby code or password is incorrect'
            }
        }

        let lastLobby,
            lobby = lobbies.createLobby(id, data.player, data.lobby, lastLobby);

        if(lastLobby)
            lastLobby.forAllPlayers(playerId => {
                io.to(`${playerId}`).emit('game:state', lobby);
            });

        if(lobby) return lobby;

        return {
            error: {
                message: `Couldn't create lobby`
            }
        }
    });

    on('game:join', (id, data) => {
        if(!_.isObject(data)) return {
            error: {
                message: 'Lobby code or password is incorrect'
            }
        }

        let lobby = lobbies.joinLobby(id, data.player, data.lobby);
        if(lobby) {
            lobby.forAllPlayers(playerId => {
                if(playerId != id)
                    io.to(`${playerId}`).emit('game:state', lobby);
            });

            return lobby;
        }

        return {
            error: {
                message: `Couldn't join lobby`
            }
        }
    });
});

io.listen(port);
console.log('Listening on port', port);
