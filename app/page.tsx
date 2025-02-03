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
    const [onlineUsers, setOnlineUsers] = useState<number>(0);

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

        const handleJoinSuccess = (data: Buffer) => {
            const decodedData = decode(data) as {
                user: User;
                roomCode: string;
                isRoomOpen: boolean;
                onlineUsers: number;
            };
            const { user, roomCode, isRoomOpen, onlineUsers } = decodedData;
            setUser(user);
            setJoined(true);
            setRoomCode(roomCode);
            setIsRoomOpen(isRoomOpen);
            setOnlineUsers(onlineUsers);
        };

        const handleUpdateOnlineUsers = (data: Buffer) => {
            const decodedData = decode(data) as { onlineUsers: number };
            const onlineUsers = decodedData.onlineUsers;
            setOnlineUsers(onlineUsers);
        };

        socket.on("new-message", handleNewMessage);
        socket.on("joined-success", handleJoinSuccess);
        socket.on("new-user-joined", handleNewUserJoined);
        socket.on("update-online-users", handleUpdateOnlineUsers);

        return () => {
            socket.off("nwe-message", handleNewMessage);
            socket.off("joined-success", handleJoinSuccess);
            socket.off("new-user-joined", handleNewUserJoined);
            socket.off("update-online-users", handleUpdateOnlineUsers);
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
                        user={user}
                        roomCode={roomCode}
                        messages={messages}
                        roomOpen={isRoomOpen}
                        onlineUsers={onlineUsers}
                    />
                ) : (
                    <JoinRoom onJoinRoom={handleOnJoinRoom} />
                )}
            </div>
        </Fragment>
    );
}

export default RootPage;
