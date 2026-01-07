'use client';

import Image from "next/image";
import { useEffect } from "react";
import { getSocket } from '../lib/socket';

export default function Home() {
  useEffect(() => {
    const socket = getSocket();
    const handleHello = (arg) => {
      console.log(arg);
    };
    socket.emit("create_room_req", true)
    socket.once('room_created', (arg) => {
      console.log(arg)
    })
    socket.on("room_created", handleHello);
    return () => socket.off("room_created", handleHello);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[800px] h-[400px] flex rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h1 className="font-bold text-4xl mb-4">Dolącz do Gry</h1>
          <p className="text-gray-600">
            Wpisz kod gry, a następnie kliknij w wygenerowany link
          </p>
          <div className="w-full mt-3">
            <input className="w-40 h-8 input outline-none" type="text" placeholder="Kod gry" maxLength={6} />
            <button className="btn ml-2">Dolącz</button>
          </div>
        </div>
        <div className="relative w-1/2 h-full">
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
