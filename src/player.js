const _ = require('underscore');

const defaultPlayerName = 'guest'

class PlayerError extends Error
{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

const playerError = message => {
    throw new PlayerError(message);
}

class Player {
    constructor(id, data) {
        if(!id) playerError(`id is ${typeof id}.`);
        if(!_.isObject(data)) playerError(`data is not an object. type of data is ${typeof data}.`);

        this.id = id;
        this.name = data.name || defaultPlayerName;
        this.leader = false;
        this.ready = false;
    }

    update(data) {
        if(_.isObject(data)) {
            this.name = data.name || defaultPlayerName;
            this.ready = data.ready === undefined ? false : data.ready;
        }
    }

    inLobby() {
        return !_.isUndefined(this.lobby);
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

    toJSON() {
        return { ...this };
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }
}

module.exports = Player;
