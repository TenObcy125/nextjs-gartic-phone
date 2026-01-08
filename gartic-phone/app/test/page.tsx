'use client';

import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function TESTPAGE()
{
    const [room_code, set_room_code] = useState('');
    const [join_room_code, set_join_room_code] = useState('');
    const [player_list, set_player_list] = useState([]);
    const [join_result, set_join_result] = useState(null)

    const create_room = () => {
        const socket = getSocket();
        socket.emit('create_room_req', true);
        socket.once('room_created', (data) => {
            console.log(data);
            set_room_code(data);
        })
    }
    const join_room = () => {
        console.log('join')
        const socket = getSocket();
        socket.emit('join', join_room_code)
        socket.once('join_result', (bool) => {
            set_join_result(bool);
        })
    }
    // const exit_room = () => {            EXITA NA RAZIE NIE ROBIE BO TAM MUSISZ
    //     const socket = getSocket();           PODAĆ NUMER POKOJU JAKO ARGUMENT A NIE CHCE
    //     socket.emit('exit', )                    MI SIĘ ROBIĆ SLUGA ŻEBY NUMER POKOUJ BYŁ W PARAMETRACH
    // }
    useEffect(() => {
        const socket = getSocket();

        const f_room_created = (data) => {
            console.log(data)
        }

        const on_player_list = (data) => {
            console.log(data)
            set_player_list(data);
        }

        socket.on("player_list", on_player_list)

        return () => {
            socket.off("player_list", on_player_list)
        }
    })

    const ROOM_INFO = ({players, room_code}) => {
        const socket = getSocket();

        return (
            <div className="bg-zinc-300 flex flex-col items-center justify-center">
                <h1>ROOM INFO</h1>
                <h1 className="text-3xl"> ROOM CODE: {room_code}</h1>
                <ul className="w-full">
                    {
                        player_list.map(p => {
                            return (
                                <li key={p.socket_id} className="w-full flex justify-between bg-amber-100">
                                    <b>username: {p.username} {p.socket_id == socket.id ? '(ty)' : ''}</b>
                                    {/* <b>socket_id: {p.socket_id}</b> */}
                                    {p.is_host && <b>(HOST)</b>}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <div>
            <h1>TEST PAGE</h1>
            { room_code === '' && <button onClick={create_room}>create room</button>}
            { room_code !== '' && <h1>ROOM CREATED</h1>}
            {player_list.length < 1 && <div className="p-3 bg-amber-200">
                <h1>JOIN ROOM</h1>
                <input type="text" maxLength={6} onChange={(e) => {set_join_room_code(e.target.value)}} placeholder="room code" className="bg-amber-50 h-full"></input>
                <button onClick={join_room} className="bg-amber-700 p-3 text-white font-bold">JOIN</button>
                {join_result == false && <h1 className="bg-red-500 text-white w-fit p-1">NIE ZNALEZIONO POKOJU</h1>}
            </div>}
            {join_result == true && <h1 className="bg-green-400 text-white p-1 w-fit">DOŁĄCZONO DO POKOJU!</h1>}
            {player_list.length > 0 && <button className="bg-red-500 p-3 text-white">EXIT ROOM</button>}
            <ROOM_INFO
                room_code={room_code}
                players={player_list}
            />
        </div>
    )
}