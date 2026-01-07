const { get_io } = require("../../io");
const generate_room_code = require("../room_code");

class Room {
    constructor() {
        this.room_code = generate_room_code();
        this.players = [];
    }
    join(player)
    {
        if (!this.players.find(p => p.socket_id == player.socket_id))
        {
            console.log('player joined room ' + this.room_code)
            this.players.push(player);
            this.someone_joined();
        }
        else
        {
            console.log('player already in room');
        }
        console.log(this.players);
    }
    someone_joined()
    {
        const io = get_io();
        io.to(this.room_code).emit("player_list", this.players);
    }
}

const get_random_name = () => {
    const usernames = [
        "Peter", "Goblin", "Magma", "Miner", "Piotr Wawrzyk", "keram",
    ]
    const random = Math.floor(Math.random() * usernames.length);
    return usernames[random];
}

class Player {
    constructor(socket_id) {
        this.socket_id = socket_id;
        this.username = get_random_name();
    }
}

module.exports = {Room, Player}