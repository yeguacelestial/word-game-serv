const _ = require('underscore');

const { LobbyError } = require('./error');

const log = require('./log');
const is = require('./is');

const Player = require('./player');

let availableLobbyCodes = [],
    lastLobbyCode = 0;

class Lobby
{
    constructor(data) {
        if(!is.Object(data)) LobbyError('Lobby data is incorrect.');
        if(!this._isValidName(data.name)) LobbyError('Lobby name is incorrect.');
        //if(!is.String(data.password)) LobbyError('Lobby password is incorrect.');

        this.code = this._generateCode();
        this.players = {};

        this.name = data.name;
        this.password = data.password;
    }


    releaseCode() {
        availableLobbyCodes.push(this.code);
    }

    addPlayer(player) {
        if(!(player instanceof Player)) return;

        player.setLobby(this.code);
        this.players[player.id] = player;

        log.info();
        log.infobold('Player added to lobby.');
        log.info(`Player '${player.name}' with ID: ${player.id}.`);
        log.info(`Added to lobby with code: ${this.code}.`);
        log.info('Player:', player);
        log.info('Lobby:', this);
    }

    removePlayer(id) {
        const player = this.getPlayer(id);
        if(!player) return;

        log.warning();
        log.warningbold('Player removed from lobby.');
        log.warning(`Player '${player.name}' with ID: ${id}.`);
        log.warning(`Removed from lobby with code: ${this.code}.`);
        log.warning('Player:', player);
        log.warning('Lobby:', this);

        if(player.isLeader())
            this._makeNewLeader(id);

        delete this.players[id];
    }

    updatePlayer(id, data) {
        const player = this.getPlayer(id);
        if(!player) return;

        player.update(data);

        log.info();
        log.infobold('Player updated.');
        log.info(`Player with ID: ${id}.`);
        log.info(`Updated at lobby with code: ${this.code}.`);
        log.info('Player:', player);
        log.info('Lobby:', this);
    }

    getPlayer(id) {
        return this.players[id];
    }

    hasPlayer(id) {
        return this.getPlayer(id) !== undefined;
    }

    empty() {
        return is.Empty(this.players);
    }

    forAllPlayers(func) {
        if(!is.Function(func)) return;

        for(const id in this.players)
            func(id, this.players[id]);
    }

    _makeNewLeader(lastLeader) {
        for(const id in this.players) {
            if(id === lastLeader) continue;

            const player = this.players[id];
            player.makeLeader();

            log.info();
            log.infobold('Lobby set new leader.');
            log.info(`Player '${player.name}' with ID: ${id}.`);
            log.info(`Is new leader of lobby with code: ${this.code}.`);
            log.info('Player:', player);
            log.info('Lobby:', this);

            break;
        }
    }

    _isValidName(name) {
        if(!is.String(name)) return false;
        return true;
    }

    _generateCode() {
        return availableLobbyCodes.shift() || ++lastLobbyCode;
    }

    toString() {
        return JSON.stringify(this, null, 2);
    }
}

module.exports = Lobby;
