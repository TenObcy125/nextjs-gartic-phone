const { Server } = require('socket.io');
const generate_room_code = require('./source/room_code.js');
const rooms_handle_socket = require('./source/rooms/handle_socket.js');
const { set_io } = require('./io.js');
const io = new Server(5000);

set_io(io);

io.on('connection', (socket) => {
    console.log('connected');
    socket.emit("hello", "goblin676767 goblia");
    
    rooms_handle_socket(socket);

})