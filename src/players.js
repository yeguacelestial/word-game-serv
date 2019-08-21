var _ = require('underscore');
var Player = require('./player');

class Players {
    constructor() {
        this._players = [];
    }

    create(id, data) {
        this.disconnect(id);

        const player = new Player(id, data);
        this._players[id] = player;

        console.log('Player created\n', player);
    }

    update(id, data) {
        if(_.isUndefined(this._players[id]))
            console.error('Error updating player. Player with id', id, 'doesn\'t exist');
        else {
            this._players[id].update(data);
            console.log('Player updated\n', this._players[id]);
        }
    }

    disconnect(id, reason) {
        const player = this._players[id];

        if(_.isUndefined(player))
            console.error('Error disconnecting player. Player with id', id, 'doesn\'t exist');
        else {
            console.log('Player disconnected, reason:', reason, '\n', player);

            delete this._players[id];
        }
    }

    join(id, data) {
        const player = this._players[id];

        if(_.isUndefined(player))
            console.error('Error joining lobby. Player with id', id, 'doesn\'t exist');
        else {
            // TODO: Lobby joining
        }
    }

    getById(id) {
        return this._players[id];
    }

    getByName(name) {
        return this._players.find(player => player.name === name);
    }
}

module.exports = new Players();
