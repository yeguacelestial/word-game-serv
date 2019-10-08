const _ = require('underscore');

const { PlayerError } = require('./error');

const is = require('./is');

const defaultPlayerName = 'guest'

class Player {
    constructor(id, data) {
        if(!id) PlayerError('Player ID is incorrect.');
        if(!is.Object(data)) PlayerError('Player data is incorrect.');

        this.id = id;
        this.name = this._getValidName(data.name);

        this.leader = false;
        this.ready = false;
    }

    update(data) {
        if(!is.Object(data)) PlayerError('Player data is incorrect.');

        this.name = this._getValidName(data.name);
        this.ready = data.ready === undefined ? false : data.ready;
    }

    inLobby() {
        return !_.isUndefined(this.lobby);
    }

    setLobby(code) {
        this.lobby = code;
    }

    isLeader() {
        return this.leader;
    }

    makeLeader() {
        this.leader = true;
    }

    toggleReady() {
        this.ready = !this.ready;
    }

    makeReady() {
        this.ready = true;
    }

    _getValidName(name) {
        return name || defaultPlayerName;
    }

    toString() {
        return JSON.stringify(this, null, 2);
    }
}

module.exports = Player;
