"use client";

import Message from "./Message";
import ChatForm from "./ChatForm";
import { socket } from "@/lib/socketClient";

interface RoomProps {
    roomCode: string;
    username: string;
    messages: Message[];
}

const Room = (props: RoomProps) => {
    const { roomCode, username, messages } = props;

    const handleOnSendMessage = (message: string) => {
        const data = { roomCode, message, sender: username };
        socket.emit("message", data);
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-4">Room: {roomCode}</h1>
            <div
                className="bg-zinc-100 overflow-y-auto border-2 border-zinc-200
                rounded-lg p-4 mb-4 h-[500px]">
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        sender={message.sender}
                        message={message.msg}
                        isOwnMessage={message.sender === username}
                    />
                ))}
            </div>
            <ChatForm onSendMessage={handleOnSendMessage} />
        </div>
    );
};

export default Room;
