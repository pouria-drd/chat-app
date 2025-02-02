"use client";

import Room from "@/components/chat/Room";
import { decode } from "@msgpack/msgpack";
import { socket } from "@/lib/socketClient";
import JoinRoom from "@/components/chat/JoinRoom";
import { Fragment, useEffect, useState } from "react";

function RootPage() {
    const [user, setUser] = useState<User>();
    const [joined, setJoined] = useState(false);
    const [isRoomOpen, setIsRoomOpen] = useState(true);
    const [roomCode, setRoomCode] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const handleOnJoinRoom = (roomCode: string, username: string) => {
        if (!roomCode.trim() || !username.trim()) return;
        socket.emit("join-room", { roomCode, username });
    };

    useEffect(() => {
        const handleNewMessage = (data: Buffer) => {
            const decodedMessage = decode(data) as Message;
            setMessages((prev) => [...prev, decodedMessage]);
        };

        const handleNewUserJoined = (data: Buffer) => {
            const decodedMessage = decode(data) as Message;
            setMessages((prev) => [
                ...prev,
                { sender: "Server", msg: decodedMessage.msg },
            ]);
        };

        const handleJoinSuccess = ({
            roomCode,
            user,
            isRoomOpen,
        }: {
            roomCode: string;
            user: User;
            isRoomOpen: boolean;
        }) => {
            setUser(user);
            setJoined(true);
            setRoomCode(roomCode);
            setIsRoomOpen(isRoomOpen);
        };

        socket.on("new-message", handleNewMessage);
        socket.on("joined-success", handleJoinSuccess);
        socket.on("new-user-joined", handleNewUserJoined);

        return () => {
            socket.off("nwe-message", handleNewMessage);
            socket.off("joined-success", handleJoinSuccess);
            socket.off("new-user-joined", handleNewUserJoined);
        };
    }, []);

    return (
        <Fragment>
            <title>
                {!joined ? "Chat App" : `Chat App | Room ${roomCode}`}
            </title>
            <div className="flex items-center justify-center h-dvh w-full">
                {joined && user ? (
                    <Room
                        roomCode={roomCode}
                        user={user}
                        messages={messages}
                        roomOpen={isRoomOpen}
                    />
                ) : (
                    <JoinRoom onJoinRoom={handleOnJoinRoom} />
                )}
            </div>
        </Fragment>
    );
}

export default RootPage;
