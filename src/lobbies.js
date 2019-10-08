const log = require('./log');
const is = require('./is');

const Lobby = require('./lobby');
const Player = require('./player');

const error = (functionName, playerId, err) => log.error(err, functionName, 'Player ID:', playerId);

class Game
{
    constructor() {
        this.lobbies = {};

        this._playerCurrentLobbyCode = {};
    }

    createLobby(playerId, playerData, lobbyData) {
        try {
            let lobby = new Lobby(lobbyData),
                player = new Player(playerId, playerData);

            log.success();
            log.successbold('Lobby created.');
            log.success(`Lobby with code: ${lobby.code}.`);
            log.success(`Created by player '${player.name}' with ID: ${playerId}.`);

            player.makeLeader();

            this._addLobby(lobby);
            this._lobbyAddPlayer(lobby, player);

            return lobby;
        } catch(e) {
            switch(e.name) {
                case 'LobbyError':
                case 'PlayerError':
                    error('createLobby', playerId, e); break;
                default: throw e;
            }

        }
    }

    joinLobby(playerId, playerData, lobbyData) {
        try {
            let lobby = this._getLobbyFromData(lobbyData);

            if(!lobby) {
                log.success();
                log.errorbold('Error joining lobby. Lobby data is incorrect.');
                return;
            }

            let player = new Player(playerId, playerData);

            if(!this._hasValidLobbyCredentials(lobby, lobbyData))
                return;

            log.success();
            log.successbold('Player joined lobby.');
            log.success(`Player '${player.name}' with ID: ${playerId}.`);
            log.success(`Joined lobby with code: ${lobby.code}.`);

            this._lobbyAddPlayer(lobby, player);
            return lobby;

        } catch(e) {
            if(e.name === 'PlayerError') error('joinLobby', playerId, e)
            else throw e;
        }
    }

    updatePlayer(playerId, playerData) {
        if(!is.Object(playerData)) return;

        try {
            let lobby = this._getPlayerCurrentLobby(playerId);
            if(!lobby) return;

            lobby.updatePlayer(playerId, playerData);
            return lobby;
        } catch(e) {
            if(e.name === 'PlayerError') error(joinLobby.name, playerId, e)
            else throw e;
        }
    }

    removePlayerFromCurrentLobby(playerId) {
        const currentLobby = this._getPlayerCurrentLobby(playerId);
        this._lobbyRemovePlayer(currentLobby, playerId);

        return currentLobby;
    }

    getLobby(code) {
        return this.lobbies[code];
    }

    hasLobby(code) {
        return this.getLobby(code) !== undefined;
    }

    _addLobby(lobby) {
        if(!(lobby instanceof Lobby)) return;
        this.lobbies[lobby.code] = lobby;
    }

    _lobbyAddPlayer(lobby, player) {
        if(!(lobby instanceof Lobby)) return;
        if(!(player instanceof Player)) return;

        lobby.addPlayer(player);
        this._setPlayerCurrentLobbyCode(player.id, lobby.code);
    }

    _lobbyRemovePlayer(lobby, playerId) {
        if(!(lobby instanceof Lobby)) return;

        lobby.removePlayer(playerId);
        if(!lobby.empty()) return;

        log.warning();
        log.warningbold('Lobby deleted.');
        log.warning(`Lobby with code: ${lobby.code} deleted.`);

        lobby.releaseCode();
        this._deleteLobby(lobby.code);
    }

    _deleteLobby(code) {
        if(this.lobbies[code]) delete this.lobbies[code];
    }

    _getLobbyFromData(lobbyData) {
        if(!is.Object(lobbyData)) return undefined;
        return this.getLobby(lobbyData.code);
    }

    _getPlayerCurrentLobby(playerId) {
        return this.lobbies[this._getPlayerCurrentLobbyCode(playerId)];
    }

    _setPlayerCurrentLobbyCode(playerId, code) {
        if(!playerId || !code) return;
        this._playerCurrentLobbyCode[playerId] = code;
    }

    _getPlayerCurrentLobbyCode(playerId) {
        return this._playerCurrentLobbyCode[playerId];
    }

    _hasValidLobbyCredentials(lobby, data) {
        if(!(lobby instanceof Lobby)) return false;
        if(!lobby.password) return true; // Password is correct if left empty.
        if(!is.Object(data)) return false;

        return lobby.password === data.password;
    }
}

module.exports = () => new Game();
