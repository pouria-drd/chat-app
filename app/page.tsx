"use client";

import Room from "@/components/chat/Room";
import { decode } from "@msgpack/msgpack";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import JoinRoom from "@/components/chat/JoinRoom";

function RootPage() {
    const [joined, setJoined] = useState(false);
    const [roomCode, setRoomCode] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const handleOnJoinRoom = (roomCode: string, username: string) => {
        if (!roomCode.trim() || !username.trim()) return;
        setRoomCode(roomCode);
        setUsername(username);
        socket.emit("join-room", { roomCode, username });
        setJoined(true);
    };

    useEffect(() => {
        const handleMessage = (data: Buffer) => {
            const decodedMessage = decode(data) as Message;
            setMessages((prev) => [...prev, decodedMessage]);
        };

        const handleUserJoined = (data: Buffer) => {
            const decodedMessage = decode(data) as Message;
            setMessages((prev) => [
                ...prev,
                { sender: "Server", msg: decodedMessage.msg },
            ]);
        };

        socket.on("message", handleMessage);
        socket.on("user_joined", handleUserJoined);

        return () => {
            socket.off("message", handleMessage);
            socket.off("user_joined", handleUserJoined);
        };
    }, []);

    return (
        <div className="flex items-center justify-center h-dvh w-full">
            {joined ? (
                <Room
                    roomCode={roomCode}
                    username={username}
                    messages={messages}
                />
            ) : (
                <JoinRoom onJoinRoom={handleOnJoinRoom} />
            )}
        </div>
    );
}

export default RootPage;
