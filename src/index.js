const io = require('socket.io')();
const _ = require('underscore');
const chalk = require('chalk');

const port = 8000;

const lobbies = require('./lobbies')();

io.on('connection', socket => {
    const id = socket.id;

    const error = message => ({ message });

    const gamestate = (currentLobby, currentPlayerId) => ({
        currentPlayer: currentLobby ? currentLobby.getPlayer(currentPlayerId) : undefined,
        currentLobby
    });

    const emitUpdate = (lobby, skipNotifier = true) => {
        if(lobby) lobby.forAllPlayers((playerId, player) => {
            if(playerId === id && skipNotifier) return;
            io.to(`${playerId}`).emit('game:update', null, gamestate(lobby, playerId));
        });
    }

    console.log();
    console.log(chalk.green.bold('Player connected\nPlayer ID:', socket.id));

    socket.on('disconnect', reason => {
        console.log(chalk.red.bold(`Player disconnected, reason: ${reason}\nPlayer ID: ${id}`));

        emitUpdate(lobbies.removePlayerFromCurrentLobby(id));
    });

    socket.on('game:create:lobby', (player, lobby, callback) => {
        let lastLobby = lobbies.removePlayerFromCurrentLobby(id),
            createdLobby = lobbies.createLobby(id, player, lobby);

        emitUpdate(lastLobby);

        if(_.isFunction(callback)) {
            if(createdLobby) callback(null, gamestate(createdLobby, id));
            else callback(error(`Couldn't create lobby`));
        }
    });

    socket.on('game:join:lobby', (player, lobby, callback) => {
        let lastLobby = lobbies.removePlayerFromCurrentLobby(id),
            joinedLobby = lobbies.joinLobby(id, player, lobby);

        emitUpdate(lastLobby);
        emitUpdate(joinedLobby);

        if(_.isFunction(callback)) {
            if(joinedLobby) callback(null, gamestate(joinedLobby, id));
            else callback(error(`Couldn't join lobby`));
        }
    });

    socket.on('game:update:player', (player, callback) => {
        const currentLobby = lobbies.updatePlayer(id, player);
        emitUpdate(currentLobby, id);

        if(_.isFunction(callback)) {
            if(currentLobby) callback(null, gamestate(currentLobby, id));
            else callback(error(`Couldn't change nickname`));
        }
    });
});

io.listen(port);
console.log('Listening on port', port);
