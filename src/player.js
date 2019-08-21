class Player
{
    constructor(id, { name, lobby }) {
        this._id = id;
        this._name = name;
        this._lobby = lobby;
    }

    get id () {
        return this._id;
    }

    get lobby () {
        return this._lobby;
    }

    update({ name, lobby }) {
        this._name = name;
        this._lobby = lobby;
    }
}

module.exports = Player;
