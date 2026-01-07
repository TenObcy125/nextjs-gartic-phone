const generate_room_code = require("../room_code");
const { Room, Player } = require("./room");
const {room_map} = require("./room_map");

const rooms_handle_socket = (socket) => {

    socket.on("create_room_req", (data) => {
        console.log(data);
        const new_room = new Room();
        const new_player = new Player(socket.id)
        new_room.join(new_player);
        const room_code = new_room.room_code;
        socket.emit('room_created',  room_code)
        socket.join(new_room.room_code);
        room_map.set(new_room.room_code, new_room);
    })
    socket.on('join', (data) => {
        const room_code = data;
        const destination = room_map.find(room => room.room_code == room_code);
        const new_player = new Player(socket.id)

        destination.join(new_player);
    })

}

module.exports = rooms_handle_socket;