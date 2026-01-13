require("dotenv").config();

const express = require("express");
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const fileRoutes = require('./api/fileRoutes.js');

const generate_room_code = require("./source/room_code.js");
const rooms_handle_socket = require("./source/rooms/handle_socket.js");
const { set_io } = require("./io.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

set_io(io);

app.use(express.json());
app.use(cors());

app.get("/api/status", (req, res) => {
    res.json({ ok: true });
});

app.post('/api/upload', fileRoutes.upload.single("file"), fileRoutes.uploadFile);
app.get('/api/files', fileRoutes.getFiles);

io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.emit("hello", "goblin676767 goblia");
    rooms_handle_socket(socket);
});

/* ===== START ===== */
server.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
