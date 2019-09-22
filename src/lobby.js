const _ = require('underscore');
const chalk = require('chalk');

class Lobby {
    constructor(code, data) {
        if(!code) throw new Error('code cannot be undefined');
        if(!_.isObject(data)) data = {}

        this.code = code;
        this.players = {};

        this.name = data.name;
        this.password = data.password;
    }

    addPlayer(player) {
        if(player) {
            console.log(chalk.blue('Player Add', player));

            player.lobby = this.code;
            this.players[player.id] = player;
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
