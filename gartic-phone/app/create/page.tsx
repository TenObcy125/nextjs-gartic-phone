"use client";

import Image from "next/image"
import { Link, Crown, Trash } from "lucide-react"
import { useEffect, useState } from "react";
import { getSocket } from '@/lib/socket';
import { toast } from "react-toastify";
import PageTransition from "@/components/PageTransition";
import { useRouter } from "next/navigation";

type Player = {
  username: string;
  is_host: boolean;
};

type PlayerRowProps = {
  username: string;
  isOwner: boolean;
};

function PlayerRow({ username, isOwner }: PlayerRowProps) {
  return (
    <li className="w-full p-4 flex flex-row items-center justify-between">
      <p className="flex items-center gap-2">
        {username}
        {isOwner && <Crown size={18} fill="orange" color="orange" />}
      </p>

      <button className="btn btn-error btn-sm text-white">
        <Trash size={18} />
      </button>
    </li>
  )
}

export default function CreateRoomPage() {
  const [players, set_players] = useState<Player[]>([]);
  const [code, setCode] = useState("HORNIK");


  const START_GAME = () => {
    const socket = getSocket();
    socket.emit('start_game', { room_code: code });
    console.log('start game clicked');
  }

  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    const handleHello = (arg: string) => {
      console.log(arg);
      setCode(arg);
    };

    socket.on('player_list', (arg: Player[]) => {
      console.log(arg);
      set_players(arg);
    })

    socket.emit("create_room_req", true)
    socket.once('room_created', (arg: string) => {
      console.log(arg)
    })

    socket.once('game_has_started', (data: string) => {
      console.log('game has started')
      router.push(`/play/${data}`);
    })

    socket.on("room_created", handleHello);
    return () => socket.off("room_created", handleHello);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    copyToast();
  }
  const copyToast = () => toast.success('Kod skopiowany!', { position: 'bottom-right' })

  return (
    <PageTransition>
      <div>
        <div className="w-full h-screen flex items-center justify-center select-none">
          <div className="w-200 h-100 flex rounded-lg shadow-lg overflow-hidden">
            <div className="w-1/2 p-6 flex flex-col justify-center">
              <div>
                <h1 className="font-bold text-4xl mb-4">Stwórz Gre</h1>
                <p className="text-gray-600">
                  Skopiuj link i udostępnij swoim znajomym aby zagrać!
                </p>
                <div className="w-full flex items-center">
                  <input value={code} disabled className="w-40 h-8 input outline-none" type="text" placeholder="Kod gry" maxLength={6} />
                  <button onClick={handleCopy} className="btn ml-2">Kopiuj! <Link className="ml-3" size={16} /></button>
                </div>
              </div>
              <div className="h-full w-full flex items-end">
                <button className="btn btn-secondary w-full" onClick={START_GAME}>Startuj Grę!</button>
              </div>
            </div>
            <div className="relative w-1/2 h-full p-10">
              <h1 className="w-full font-bold text-xl text-center my-5">Gracze</h1>
              <div className="w-full h-1 rounded-xl bg-base-content"></div>
              <ul>
                {
                  players.map((p, index) => {
                    return (
                      <PlayerRow key={index} username={p.username} isOwner={p.is_host}></PlayerRow>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}