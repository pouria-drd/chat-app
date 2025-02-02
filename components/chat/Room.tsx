"use client";

import Message from "./Message";
import ChatForm from "./ChatForm";
import { CopyIcon } from "../icons";
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socketClient";

interface RoomProps {
    user: User;
    roomCode: string;
    messages: Message[];
}

const Room = (props: RoomProps) => {
    const { roomCode, user, messages } = props;

    const handleOnSendMessage = (message: string) => {
        const data = { roomCode, message, sender: user };
        socket.emit("new-message", data);
    };

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomCode);
        alert("Room ID copied to clipboard");
    };

    // Create a reference for the messages container
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom whenever the messages state changes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="max-w-full sm:max-w-2xl mx-auto w-full space-y-4 p-4">
            <div
                className="bg-[url('/images/chat-bg.png')] bg-no-repeat bg-cover
                flex flex-col
                overflow-y-auto border-2 border-zinc-200 rounded h-[75dvh]">
                <div
                    className="bg-gray-200 bg-opacity-90 glass sticky
                    rounded-b-xl top-0 z-10 px-4 pb-6 pt-4">
                    <h1
                        onClick={handleCopyRoomId}
                        className="flex items-center gap-2
                        text-zinc-700 text-xl sm:text-2xl
                        font-bold cursor-pointer w-fit">
                        Room:
                        <span className="underline">{roomCode}</span>
                        <CopyIcon />
                    </h1>
                </div>
                <div className="px-2 py-4 flex-1">
                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            sender={message.sender}
                            message={message.msg}
                            isOwnMessage={
                                message.sender !== "Server" &&
                                message.sender.username === user.username
                            }
                        />
                    ))}
                </div>

                <div ref={messagesEndRef}></div>

                <ChatForm onSendMessage={handleOnSendMessage} />
            </div>
        </div>
    );
};

export default Room;
