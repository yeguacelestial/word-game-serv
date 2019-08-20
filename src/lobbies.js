var players = require('./players');
var Lobby = require('./lobby');

class Lobbies {
    constructor() {
        this._lobbies = [];
    }

    update(id, data) {
        let lobby = this._lobbies[id] || new Lobby(id);
        lobby.update(data);
        lobby.add_player()
        this._lobbies[id] = lobby;
    }

    delete(id) {
    }
}

module.exports = new Lobbies();
