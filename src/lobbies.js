const _ = require('underscore');
const chalk = require('chalk');

const Lobby = require('./lobby');

class Lobbies
{
    constructor() {
        this.lobbies = {};

        this._playerLobbies = {};
        this._lobbyCodes = [];
        this._lastLobbyCode = 0;
    }

    createLobby(playerId, playerData, lobbyData) {
        const code = this._generateCode();

        this._savePlayerCode(playerId, code);

        let lobby = this.lobbies[code] = new Lobby(code, lobbyData);
        console.log(chalk.green('Lobby Create', lobby));

        lobby.addPlayer(new Player(playerId, playerData));

        return lobby;
    }

    joinLobby(playerId, playerData, { code, password }) {
        if(!this.hasLobby(code)) return null;

        this._savePlayerCode(playerId, code);

        let lobby = this.lobbies[code];
        if(lobby.password !== password) return null;

        lobby.addPlayer(new Player(playerId, playerData));

        return lobby;
    }

    exitLobby(playerId) {
        const code = this._playerLobbies[playerId];
        if(_.isUndefined(code)) return null;

        delete this._playerLobbies[playerId];

        let lobby = this.lobbies[code];
        lobby.removePlayer(playerId);

        if(!lobby.empty()) return lobby;

        console.log(chalk.red('Lobby Delete', lobby));

        this._lobbyCodes.push(code);
        delete this.lobbies[code];

        console.log(chalk.red('Lobby Codes', JSON.stringify(this._lobbyCodes, null, 4)));

        return null;
    }

    hasLobby(code) {
        return !_.isUndefined(this.lobbies[code]);
    }

    _generateCode() {
        return this._lobbyCodes.shift() || ++this._lastLobbyCode;
    }

    _savePlayerCode(playerId, code) {
        this._playerLobbies[playerId] = code;
    }
}

module.exports = Lobbies;
