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

    createLobby(playerId, playerData, lobbyData) {
        try {
            let lobby = new Lobby(lobbyData),
                player = new Player(playerId, playerData);

            player.makeLeader();

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

    joinLobby(playerId, playerData, lobbyData) {
        try {
            let lobby = this._getLobbyFromData(lobbyData),
                player = new Player(playerId, playerData);

            if(this._correctLobbyPassword(lobby, lobbyData.password)) {
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

    updatePlayer(playerId, playerData) {
        if(!_.isObject(playerData)) return null;

        let lobby = this._getPlayerCurrentLobby(playerId);
        if(lobby) {
            lobby.updatePlayer(playerId, playerData);
            return lobby;
        }

        return null;
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

    _getPlayerCurrentLobby(playerId) {
        const code = this._playerCurrentLobby[playerId];
        if(code) return this.lobbies[code];

        return null;
    }
}

module.exports = Lobbies;
