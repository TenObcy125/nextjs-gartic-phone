const { get_io } = require("../../io");
const { Room, Player } = require("./room");
const room_map = require("./room_map");

const rooms_handle_socket = (socket) => {

    socket.on("create_room_req", (data) => {
        console.log(data);
        const new_room = new Room();
        const new_player = new Player(socket.id)
        const room_code = new_room.room_code;
        socket.join(new_room.room_code);
        
        new_room.join(new_player);
        socket.emit('room_created',  room_code)
        
        new_room.set_host(socket.id)
        room_map.set(new_room.room_code, new_room);
    })
    socket.on('join', (data) => {
        const io = get_io();
        console.log('join')
        const room_code = data;
        if (!room_map.has(room_code))
        {
            console.log('nie znaleziono lobby')
            socket.emit('join_result', false)
            return;
        }
        else
        {
            const destination = room_map.get(room_code);
            console.log(destination);
            const new_player = new Player(socket.id)
            socket.join(room_code);
            destination.join(new_player);
            
            io.to(room_code).emit('join_result', true);
        }
    })
    socket.on('exit', (room_code) => {
        const destination = room_map.get(room_code);
        destination.exit(socket.id);
    })
    socket.on('start_game', (data) => {
        try {
            const destination = room_map.get(data.room_code);
            destination.start_game();
        } catch (error) {
            console.log(error);
        }
    })

}

module.exports = rooms_handle_socket;