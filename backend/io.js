let io = null

const set_io = (arg) => {
    io = arg;
}

const get_io = () => {
    return io;
}

module.exports = {set_io, get_io};