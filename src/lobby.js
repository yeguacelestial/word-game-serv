const _ = require('underscore');

const emitter = require('./event_emmiter');
const players = require('./players');

class Lobby {
    constructor(id, { name, password })
    {
        this.id = id;
        this.name = name;
        this.password = password;
        this.players = {};
    }

    update({ name, password })
    {
        this.name = name;
        this.password = password;
    }

    addPlayer(playerId)
    {
        const player = players.getById(playerId);

        if(player) {
            if(player.inLobby())
                emitter.emit('lobby:player:exit', player.lobby, playerId);

            player.lobby = this.id;
            this.players[playerId] = player;

            return player;
        }

        return null;
    }

    removePlayer(id)
    {
        if(this.hasPlayer(id))
            delete this.players[id];
    }

    hasPlayer(id)
    {
        return this.players[id] !== undefined;
    }

    isEmpty()
    {
        return Object.keys(this.players).length === 0;
    }

    toJSON()
    {
        const { players, ...other } = this;
        let result = {}

        for(const id in players)
            result[id] = players[id].toJSON();

        return {
            players: result,
            ...other
        }
    }

    toString()
    {
        return 'Lobby: ' + JSON.stringify(this.toJSON(), undefined, 4);
    }
}

module.exports = Lobby;
