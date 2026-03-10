const express = require('express');
const Router = express.Router();

const results = new Map();

Router.post('/results', (req, res) => {
    const {chain, room_code} = req.body;
    if (!room_code || !chain) {
        return res.status(400).json({ message: 'room_code and chain are required' });
    }
    results.set(room_code, chain);
    return res.json({message: 'success'});
})
Router.get('/results/:room_code', (req, res) => {
    const {room_code} = req.params;
    if (!results.has(room_code)) {
        return res.status(404).json({ message: 'room not found' });
    }

    const target = results.get(room_code);
    return res.json(target);

})

module.exports = Router;