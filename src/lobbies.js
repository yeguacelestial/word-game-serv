const _ = require('underscore');
const chalk = require('chalk');

const Lobby = require('./lobby');
const Player = require('./player');

const logError = (func, playerId, error) => console.log(chalk.red.bold(func, error, 'Player ID:', playerId));

class Lobbies
{
    constructor() {
        this.lobbies = {};

        this._playerCurrentLobby = {};
    }

    createLobby(playerId, playerData, lobbyData, lastLobby) {
        try {
            let lobby = new Lobby(lobbyData),
                player = new Player(playerId, playerData);

            lastLobby = this.removePlayerFromCurrentLobby(playerId);

            console.log(chalk.green('Lobby Create', lobby));

            this._saveLobby(lobby);
            this._lobbyAddPlayer(lobby, player);

            return lobby;
        } catch(error) {
            switch(error.name) {
                case 'LobbyError':
                case 'PlayerError':
                    logError('createLobby', playerId, error);
                    break;
                default: throw error;
            }
        }

        return null;
    }

    joinLobby(playerId, playerData, lobbyData, lastLobby) {
        try {
            let lobby = this._getLobbyFromData(lobbyData),
                player = new Player(playerId, playerData);

            if(this._correctLobbyPassword(lobby, lobbyData.password)) {
                lastLobby = this.removePlayerFromCurrentLobby(playerId);

                this._lobbyAddPlayer(lobby, player);
                return lobby;
            }
        } catch(error) {
            switch(error.name) {
                case 'PlayerError':
                    logError('joinLobby', playerId, error);
                    break;
                default: throw error;
            }
        }

        return null;
    }

    hasLobby(code) {
        return !_.isUndefined(this.lobbies[code]);
    }

    getLobby(code) {
        if(!code) return null;
        const lobby = this.lobbies[code];
        return lobby ? lobby : null;
    }

    removePlayerFromCurrentLobby(playerId) {
        const currentLobbyCode = this._playerCurrentLobby[playerId],
              lobby = this.getLobby(currentLobbyCode);

        return this._lobbyRemovePlayerById(lobby, playerId);
    }

    _getLobbyFromData(lobbyData) {
        if(!_.isObject(lobbyData)) return null;
        return this.getLobby(lobbyData.code);
    }

    _correctLobbyPassword(lobby, password) {
        if(!lobby) return false;
        return lobby.password === password;
    }

    _lobbyAddPlayer(lobby, player) {
        if(lobby){
            lobby.addPlayer(player);
            this._setPlayerCurrentLobby(player.id, lobby.code);
        }
    }

    _lobbyRemovePlayerById(lobby, playerId) {
        if(lobby) {
            lobby.removePlayer(playerId);

            if(lobby.empty()) {
                console.log(chalk.red('Lobby Delete', lobby));

                lobby.destroy();
                delete this.lobbies[lobby.code];
            }

            return lobby;
        }

        return null;
    }

    _saveLobby(lobby) {
        if(lobby && lobby.code) this.lobbies[lobby.code] = lobby;
    }

    _setPlayerCurrentLobby(playerId, code) {
        this._playerCurrentLobby[playerId] = code;
    }
}

module.exports = Lobbies;
