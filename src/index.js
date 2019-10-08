const io = require('socket.io')();

const is = require('./is');
const log = require('./log');

const lobbies = require('./lobbies')();

const port = 8000;


io.on('connection', socket => {
    const id = socket.id;

    const error = message => ({ message });

    const gamestate = (lobby, playerId) => ({
        player: lobby ? lobby.getPlayer(playerId) : undefined,
        lobby,
        gamemodeVotes: {}
    });

    const emitUpdate = (lobby, skipNotifier = true) => {
        if(lobby) lobby.forAllPlayers((playerId, player) => {
            if(playerId === id && skipNotifier) return;
            io.to(`${playerId}`).emit('lobbies:update', null, gamestate(lobby, playerId));
        });
    }

    log.success();
    log.successbold('Player connected.');
    log.success(`Player ID: ${id}`);

    socket.on('disconnect', reason => {
        log.error();
        log.errorbold(`Player disconnected, reason: ${reason}.\nPlayer ID ${id}`);

        emitUpdate(lobbies.removePlayerFromCurrentLobby(id));
    });

    socket.on('lobbies:create:lobby', (player, lobby, callback) => {
        let lastLobby = lobbies.removePlayerFromCurrentLobby(id),
            createdLobby = lobbies.createLobby(id, player, lobby);

        emitUpdate(lastLobby);

        if(is.Function(callback)) {
            if(createdLobby) callback(null, gamestate(createdLobby, id));
            else callback(error(`Couldn't create lobby`));
        }
    });

    socket.on('lobbies:join:lobby', (player, lobby, callback) => {
        let lastLobby = lobbies.removePlayerFromCurrentLobby(id),
            joinedLobby = lobbies.joinLobby(id, player, lobby);

        emitUpdate(lastLobby);
        emitUpdate(joinedLobby);

        if(is.Function(callback)) {
            if(joinedLobby) callback(null, gamestate(joinedLobby, id));
            else callback(error(`Couldn't join lobby`));
        }
    });

    socket.on('lobbies:update:player', (player, callback) => {
        const currentLobby = lobbies.updatePlayer(id, player);
        emitUpdate(currentLobby, id);

        if(is.Function(callback)) {
            if(currentLobby) callback(null, gamestate(currentLobby, id));
            else callback(error(`Couldn't change nickname`));
        }
    });

    /*
    socket.on('lobbies:gamemode:vote', (mode, callback) => {
    });
    */
});

io.listen(port);
log.info('Listening on port', port);
