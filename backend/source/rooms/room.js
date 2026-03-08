const { get_io } = require("../../io");
const generate_room_code = require("../room_code");
const regular_round_scheme = require("../round_schemes/regular");

class Room {
    constructor() {
        this.room_code = generate_room_code();
        this.players = [];
        this.host_socket_id = null;
        this.is_running = false;
        this.text_time = 5; //[s]
        this.draw_time = 60; //[s]
    }
    join(player)
    {
        if (!this.players.find(p => p.socket_id == player.socket_id))
        {
            console.log('player joined room ' + this.room_code)
            this.players.push(player);
            if (this.players.length == 1)
            {
                this.set_host(player.socket_id);
            }
            this.broadcast_player_list();
        }
        else
        {
            console.log('player already in room');
        }
        console.log(this.players);
    }
    exit(socket_id)
    {
        this.players = this.players.filter(p => p.socket_id !== socket_id);
        console.log(socket_id, 'exited')
    }
    broadcast_player_list()
    {
        const io = get_io();
        io.to(this.room_code).emit("player_list", this.players);
    }
    set_host(socket_id)
    {
        this.host_socket_id = socket_id;
        const target_player = this.players.find(p => p.socket_id === socket_id);
        target_player.is_host = true;
    }
    start_game()
    {
        if(this.players.length > 1)
        {
            this.is_running = true;
            console.log('start_game')
            regular_round_scheme(this);
        }
        else
        {
            console.log("not enough people to start");
        }
    }
}

const get_random_name = () => {
    const usernames = [
        "Peter", "Goblin", "Magma", "Miner", "Piotr Wawrzyk", "keram", "OG", "Santa", "Wheelyyyy", "Lil jew"
    ]
    const random = Math.floor(Math.random() * usernames.length);
    return usernames[random];
}

class Player {
    constructor(socket_id) {
        this.socket_id = socket_id;
        this.username = get_random_name();
        this.is_host = false;
    }
}

module.exports = {Room, Player}