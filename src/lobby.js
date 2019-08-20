class Lobby {
    constructor(id, name, password, players = []) {
        this._id = id;
        this._name = name;
        this._password = password;
        this._players = players;
    }

    update({ name, password }) {
        this._name = name;
        this._password = password;
    }

    add_player(id) {

    }

    remove_player(id) {

    }

    get_player(id) {

    }
}

module.exports = Lobby;
