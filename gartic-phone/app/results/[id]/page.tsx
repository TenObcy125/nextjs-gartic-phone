'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Slide {
    type: string;
    content: string;
    author: string;
}

interface Chain {
    socket_id: string;
    slides: Slide[];
}

export default function RESULTS()
{
    const { id: room_code } = useParams();
    const [chains, set_chains] = useState<Chain[] | null>(null);
    const [loading, set_loading] = useState(true);
    const [error, set_error] = useState<string | null>(null);

    useEffect(() => {
        if (!room_code) return;
        
        fetch(`http://localhost:5000/api/results/${room_code}`)
            .then(res => res.json())
            .then((data: Chain[] | { message: string }) => {
                if ('message' in data) {
                    set_error('Results not found');
                } else {
                    set_chains(data);
                }
                set_loading(false);
            })
            .catch((err: Error) => {
                set_error(err.message);
                set_loading(false);
            });
    }, [room_code]);

    if (loading) return <main><h1>Loading...</h1></main>;
    if (error) return <main><h1>Error: {error}</h1></main>;

    return (
        <main>
            <h1>RESULTS of room {room_code}</h1>
            {chains && chains.map((chain: Chain, idx: number) => (
                <div key={idx}>
                    <h3 className="text-5xl">Chain {idx + 1}</h3>
                    {chain.slides.map((slide: Slide, slide_idx: number) => (
                        <div key={slide_idx}>
                            {slide.type === 'image' ? (
                                <div>
                                    <p><strong>{slide.type}</strong></p>
                                    <img
                                        src={`http://localhost:5000/api/images/${encodeURIComponent(slide.content)}`}
                                        alt={`slide-${slide_idx}`}
                                        style={{ maxWidth: '400px', width: '100%' }}
                                    />
                                </div>
                            ) : (
                                <p><strong>{slide.type}</strong>: {slide.content}</p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </main>
    )
}