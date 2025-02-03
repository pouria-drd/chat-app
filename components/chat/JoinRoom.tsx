"use client";

import { useState } from "react";

interface JoinRoomProps {
    onJoinRoom: (roomCode: string, username: string) => void;
}

const JoinRoom = (props: JoinRoomProps) => {
    const [roomCode, setRoomCode] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!roomCode.trim() || !username.trim()) return;
        props.onJoinRoom(roomCode, username);
    };

    return (
        <div className="flex flex-col items-center max-w-64 mx-auto space-y-4 w-ful">
            <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold">Join a room</h1>
                <p className="text-zinc-500">
                    fill out the form below to join a room
                </p>
            </div>
            <form
                onSubmit={handleJoinRoom}
                className="flex flex-col gap-2.5 w-full">
                <input
                    min={1}
                    required
                    type="text"
                    name="username"
                    value={username}
                    placeholder="nickname"
                    className="flex-1 rounded-lg text-zinc-700
                    selection:bg-zinc-300 selection:text-zinc-700
                    border-2 focus:border-zinc-400 focus:outline-none px-4 py-2"
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    min={1}
                    required
                    type="text"
                    name="roomCode"
                    value={roomCode}
                    placeholder="room code"
                    className="flex-1 rounded-lg
                    text-zinc-700 selection:bg-zinc-300 selection:text-zinc-700
                    border-2 focus:border-zinc-400 focus:outline-none px-4 py-2"
                    onChange={(event) => setRoomCode(event.target.value)}
                />
                <button
                    type="submit"
                    className="rounded-lg text-white bg-zinc-700 hover:bg-zinc-800 px-4 py-2">
                    Join Room
                </button>
            </form>
        </div>
    );
};

export default JoinRoom;
