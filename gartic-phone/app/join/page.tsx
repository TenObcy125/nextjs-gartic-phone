'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { getSocket } from '@/lib/socket';
import { useRouter } from "next/navigation";


export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter()

  const handleJoin = () => {
    const socket = getSocket();

    router.push(`/play/${code}`);
    socket.emit('join', code);
  }

  useEffect(() => {
    const socket = getSocket();
    const handleHello = (arg) => {
      console.log(arg);
    };
    socket.emit("create_room_req", true)
      

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
          <div className="w-full my-5 flex items-center">
            <input className="w-40 h-8 input outline-none"
              onInput={(e: React.FormEvent<HTMLInputElement>) => setCode(e.currentTarget.value)} 
              type="text" 
              placeholder="Kod gry"
              maxLength={6} 
            />
            <button className="btn ml-2" onClick={handleJoin}>Dolącz</button>
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
