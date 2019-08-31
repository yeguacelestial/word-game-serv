class Player
{
    constructor(id, { name })
    {
        this.id = id;
        this.name = name;
    }

    inLobby() {
        return this.lobby !== undefined;
    }

    update({ name })
    {
        this.name = name;

        return this;
    }

    toJSON()
    {
        const { ...all } = this;
        return all;
    }

    toString()
    {
        return 'Player: ' + JSON.stringify(this.toJSON(), undefined, 4);
    }
}

module.exports = Player;
