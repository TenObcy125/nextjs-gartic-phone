'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { getSocket } from '@/lib/socket';
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const [code, setCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const handleJoin = () => {
    const socket = getSocket();

    setShowPopup(true); // 👈 pokaz popup
    socket.emit('join', code);

    //router.push(`/play/${code}`);
  };

  useEffect(() => {
    const socket = getSocket();

    socket.emit("create_room_req", true);

    socket.on("game_started", () => {
      setShowPopup(true); // 👈 zamknij popup po starcie gry
    });

    return () => {
      socket.off("game_started");
    };
  }, []);

  return (
    <PageTransition text="Dołącz do gry">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[800px] h-[400px] flex rounded-lg shadow-lg overflow-hidden">
          
          {/* LEWA STRONA */}
          <div className="w-1/2 p-6 flex flex-col justify-center">
            <h1 className="font-bold text-4xl mb-4">Dołącz do Gry</h1>
            <p className="text-gray-600">
              Wpisz kod gry, a następnie kliknij w wygenerowany link
            </p>

            <div className="w-full my-5 flex items-center">
              <input
                className="w-40 h-8 input input-bordered outline-none"
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  setCode(e.currentTarget.value)
                }
                type="text"
                placeholder="Kod gry"
                maxLength={6}
              />
              <button className="btn ml-2" onClick={handleJoin}>
                Dołącz
              </button>
            </div>
          </div>

          {/* PRAWA STRONA */}
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

      {/* POPUP */}
      {showPopup && (
        <dialog className="modal modal-open">
          <div className="modal-box flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg"></span>

            <h3 className="font-bold text-lg text-center">
              Gra rozpocznie się po uruchomieniu przez właściciela pokoju...
            </h3>
          </div>
        </dialog>
      )}
    </PageTransition>
  );
}
