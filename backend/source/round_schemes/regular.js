const { get_io } = require("../../io");

const regular_round_scheme = (ROOM_OBJ) => {
    const io = get_io();
    const room_code = ROOM_OBJ.room_code;
    io.to(room_code).emit('game_has_started', ROOM_OBJ.room_code);
    console.log('regular round');

    const players = ROOM_OBJ.players;
    const rounds_count = players.length + 1;
    let current_round = 0;

    const broadcast_phase = (phase_type) => {
        io.to(room_code).emit('next_phase', {type: phase_type});
    }
    let submitted = [];

    function turn() {
        if (rounds_count == current_round)
        {
            return;
        }
        current_round++;
        submitted = [];
        console.log('turn')
        if (current_round == 1)
        {
            broadcast_phase('text');
        }
        else if (current_round % 2 == 0)
        {
            broadcast_phase('draw');
        }
        else {
            broadcast_phase('text');
        }

        setTimeout(turn, ROOM_OBJ.text_time * 1000);
    }
    turn();

}

module.exports = regular_round_scheme;