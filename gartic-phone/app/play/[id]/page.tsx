'use client'

import { useEffect, useState } from "react";
import { getSocket } from '@/lib/socket';
import { useParams } from "next/navigation";

export default function PlayPage() {
    const {id} = useParams();

    useEffect(() => {
        const socket = getSocket();

        socket.emit('join', id )
    })

    return (
        <div>
            
        </div>
    )
}