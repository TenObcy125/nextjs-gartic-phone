

const generate_room_code = () => {
    const chars = 'qwertyuiopasdfghjklzxcvbnm1234567890';
    let output = '';

    for (let i = 0; i < 6; i++)
    {
        const random = Math.floor(Math.random() * chars.length);
        output += chars[random];
    }
    console.log(output);
    return output.toLocaleUpperCase();
}

module.exports = generate_room_code;