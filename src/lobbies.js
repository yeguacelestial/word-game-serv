const emitter = require('./event_emmiter');
const _ = require('underscore');
const chalk = require('chalk');

const Lobby = require('./lobby');

var lobbies = {};
var nextLobbyId = 0;
var availableIds = [];

function lobbyExists(id)
{
    return lobbies[id] !== undefined;
}

function createLobby(playerId, data)
{
    const id = availableIds.pop() || ++nextLobbyId;
    const lobby = new Lobby(id, data);

    if(lobby.addPlayer(playerId)) {
        lobbies[id] = lobby;

        console.log(chalk.green(lobby.toString()));

        return lobby;
    }
}

function deleteLobby(id)
{
    if(!lobbyExists(id)) return;

    console.log(chalk.red(lobbies[id].toString()));

    availableIds.push(id);
    delete lobbies[id];
}

function removePlayer(id, playerId)
{
    if(!lobbyExists(id)) return;

    lobbies[id].removePlayer(playerId);
    if(lobbies[id].isEmpty()) deleteLobby(id);
}

emitter.on('lobby:player:exit', removePlayer);

module.exports = {
    lobbyExists,
    createLobby
}
