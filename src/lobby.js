const _ = require('underscore');
const chalk = require('chalk');

class LobbyError extends Error
{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

const lobbyError = message => {
    throw new LobbyError(message);
}

let availableLobbyCodes = [],
    lastLobbyCode = 0;

class Lobby
{
    constructor(data) {
        if(!_.isObject(data)) lobbyError(`data is not an object. type of data is ${typeof data}.`);
        if(_.isUndefined(data.name)) lobbyError(`data.name is ${typeof data.name}.`);
        if(_.isUndefined(data.password)) lobbyError(`data.password is ${typeof data.password}.`);

        this.code = this._generateCode();
        this.players = {};

        this.name = data.name;
        this.password = data.password;
    }

    destroy() {
        availableLobbyCodes.push(this.code);
    }

    addPlayer(player, callback) {
        if(player) {
            console.log(chalk.blue('Player Add', player));

            player.lobby = this.code;
            this.players[player.id] = player;

            if(_.isFunction(callback)) callback(player.id, player);
        }
    }

    removePlayer(id) {
        if(this.hasPlayer(id)) {
            console.log(chalk.blue('Player Remove', this.players[id]));

            delete this.players[id];
        }
    }

    getPlayer(id) {
        if(id) return this.players[id];
        return null;
    }

    hasPlayer(id) {
        if(id) {
            const player = this.players[id];
            return !_.isUndefined(player);
        }

        return false;
    }

    empty() {
        return _.isEmpty(this.players);
    }

    forAllPlayers(func) {
        if(_.isFunction(func))
            for(const id in this.players)
                func(id, this.players[id]);
    }

    _generateCode() {
        return availableLobbyCodes.shift() || ++lastLobbyCode;
    }

    toJSON() {
        const { players, ...other } = this;

        const object = {};
        for(const id in players)
            object[id] = players[id].toJSON();

        return { players: object, ...other };
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }
}

module.exports = Lobby;
