const _ = require('underscore');
const chalk = require('chalk');

const emitter = require('./event_emmiter');
const Player = require('./player');

var players = {};

function getAll()
{
    return players;
}

function getById(id)
{
    return players[id];
}

function hasPlayer(id)
{
    return players[id] !== undefined;
}

function updatePlayer(id, data)
{
    if(hasPlayer(id)) {
        const before = players[id].toString();
        const after = players[id].update(data).toString();

        console.log(chalk.blue(before, '=>', after));

        return players[id];
    }

    return null;
}

function createPlayer(id, data)
{
    deletePlayer(id);

    players[id] = new Player(id, data);

    console.log(chalk.green(players[id].toString()));

    return players[id];
}

function deletePlayer(id)
{
    const player = getById(id);

    if(player) {
        console.log(chalk.red(player.toString()));

        if(player.inLobby())
            emitter.emit('lobby:player:exit', player.lobby, id);

        delete players[id];
    }
}

module.exports = {
    getAll,
    getById,
    hasPlayer,
    deletePlayer,
    createPlayer,
    updatePlayer,
}
