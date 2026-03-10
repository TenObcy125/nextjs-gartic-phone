const { get_io } = require("../../io");

const regular_round_scheme = async (ROOM_OBJ) => {
    const io = get_io();
    const room_code = ROOM_OBJ.room_code;
    io.to(room_code).emit('game_has_started', ROOM_OBJ.room_code);
    console.log('regular round started');
    const players = ROOM_OBJ.players;
    const rounds_count = players.length + 1;
    let current_round = 0;
    const broadcast_phase = (phase_type) => {
        let prev = [];
        if (current_round > 1)
        {
        players.forEach(p => {
            const to_chain_of = reference.get(p.socket_id);
            const chain = chains.find(c => c.socket_id == to_chain_of);
            prev.push({reciever: p.socket_id, content: chain.slides[current_round - 2]})
        })
        }
        
        io.to(room_code).emit('next_phase', { type: phase_type, prev, current_round });
    }
    let submitted = [];
    let turn_timeout = null;
    const sockets = await io.in(room_code).fetchSockets();
    const players_count = players.length;

    const chains = [];
    players.forEach(player => {
        chains.push({socket_id: player.socket_id, slides: []});
    })

    const reference = new Map(); // SOCKET_ID (writer/painter) -> SOCKET_ID (append to chain of this socket_id)

    const update_reference = () => {
        players.forEach((player, player_index) => {
            const shift_index = (player_index + current_round) % players_count;
            reference.set(player.socket_id, players[shift_index].socket_id);
        })
    }
    update_reference();

    sockets.forEach(socket => {
        socket.removeAllListeners('submit');
    });

    sockets.forEach(socket => {
        socket.on('submit', (data) => {
            if (submitted.find(s => s.socket_id === socket.id)) return;

            const type = data.type;
            const content = data.content;

            const chain = chains.find(c => c.socket_id == reference.get(socket.id));
            chain.slides.push({author: socket.id, type, content});

            submitted.push({ socket_id: socket.id, data });
            console.log(`submit from ${socket.id}`, data);

            if (submitted.length >= players.length) {
                clearTimeout(turn_timeout);
                turn();
            }
        });
    });

    function turn() {
        if (rounds_count == current_round) {
            game_over();
            return;
        }
        update_reference();
        current_round++;
        submitted = [];
        console.log('turn', current_round);

        let phase_type;
        if (current_round == 1) {
            phase_type = 'text';
        } else if (current_round % 2 == 0) {
            phase_type = 'draw';
        } else {
            phase_type = 'text';
        }
        console.log(chains);

        broadcast_phase(phase_type);
        const phase_time = phase_type === 'draw' ? ROOM_OBJ.draw_time : ROOM_OBJ.text_time;
        turn_timeout = setTimeout(turn, phase_time * 1000);
    }
    turn();

    const game_over = () => {
        io.to(room_code).emit('game_over', room_code);
        console.log('game_over!');

        fetch('http://localhost:5000/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_code, chain: chains })
        })
            .then((response) => response.json())
            .then((result) => console.log('results_saved', result))
            .catch((error) => console.log('results_save_error', error.message));
        
    }
}

module.exports = regular_round_scheme;