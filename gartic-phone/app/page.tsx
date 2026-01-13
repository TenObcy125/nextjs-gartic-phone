"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-3xl">
          <h1 className="font-extrabold text-3xl text-purple-700 mb-4">Dołącz do Gry</h1>
          <Image
            src="/rocket.png"
            alt="Rocket Icon"
            width={150}
            height={150}
            className="mb-4"
          />
          <p className="text-gray-700 text-center mb-6">
            Wpisz kod gry i dołącz do pokoju, w którym przygoda już czeka!
          </p>
          <button onClick={() => router.push('/join')} className="btn btn-primary w-40">Dołącz</button>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-3xl">
          <h1 className="font-extrabold text-3xl text-pink-600 mb-4">Stwórz Grę</h1>
          <Image
            src="/pencil.png"
            alt="Pencil Icon"
            width={150}
            height={150}
            className="mb-4"
          />
          <p className="text-gray-700 text-center mb-6">
            Stwórz własny pokój i zaproś znajomych do wspólnej zabawy.
          </p>
          <button onClick={() => router.push('/create')} className="btn btn-secondary w-40">Stwórz</button>
        </div>

      </div>
    </div>
  );
}
