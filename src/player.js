const _ = require('underscore');

const defaultPlayerName = 'guest'

class Player {
    constructor(id, data) {
        if(!id) throw new Error('id cannot be undefined');
        if(!_.isObject(data)) data = {}

        this.id = id;
        this.name = data.name || defaultPlayerName;
    }

    inLobby() {
        return !_.isUndefined(this.lobby);
    }

    toJSON() {
        return { ...this };
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }
}

module.exports = Player;
