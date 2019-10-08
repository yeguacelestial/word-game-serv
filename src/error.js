class LobbyError extends Error
{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class PlayerError extends Error
{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class GameError extends Error
{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

module.exports = {
    LobbyError: message => { throw new LobbyError(message) },
    PlayerError: message => { throw new PlayerError(message) },
    GameError: message => { throw new GameError(message) },
}
