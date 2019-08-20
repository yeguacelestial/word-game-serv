var _ = require('underscore');
var Player = require('./player');

class Players {
    constructor() {
        this._players = [];
    }

    update(id, data) {
        let player = this._players[id] || new Player(id);
        player.update(data);
        this._players[id] = player;
    }

    delete(id) {
        if(this._players[id])
            delete this._players[id];
    }
}

module.exports = new Players();
