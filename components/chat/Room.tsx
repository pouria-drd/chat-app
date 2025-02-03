"use client";

import Message from "./Message";
import ChatForm from "./ChatForm";
import { CopyIcon } from "../icons";
import { socket } from "@/lib/socketClient";
import { useEffect, useRef, useState } from "react";

interface RoomProps {
    user: User;
    roomCode: string;
    messages: Message[];
    roomOpen: boolean;
    onlineUsers: number;
}

const Room = (props: RoomProps) => {
    const { roomCode, user, messages, roomOpen } = props;
    // Create a reference for the messages container
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isRoomOpen, setIsRoomOpen] = useState<boolean>(roomOpen);

    const handleOnSendMessage = (message: string) => {
        if (!isRoomOpen) return;
        const data = { roomCode, message, sender: user };
        socket.emit("new-message", data);
    };

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomCode);
        alert("Room ID copied to clipboard");
    };

    const handleToggleRoomStatus = () => {
        socket.emit("toggle-room-open-status", { roomCode });
    };

    useEffect(() => {
        const handleChatStatus = ({ chatOpen }: { chatOpen: boolean }) => {
            setIsRoomOpen(chatOpen);
        };

        socket.on("is-room-open-status", handleChatStatus);

        return () => {
            socket.off("is-room-open-status", handleChatStatus);
        };
    }, []);

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
                flex flex-col overflow-y-auto border-2 border-zinc-200 rounded h-[75dvh]">
                <div
                    className="bg-gray-200 bg-opacity-90 glass sticky
                    flex items-center justify-between
                    rounded-b-xl top-0 z-10 p-4">
                    <div>
                        <h1
                            onClick={handleCopyRoomId}
                            className="flex items-center gap-2 text-center
                        text-zinc-700 text-xl sm:text-2xl
                        font-bold cursor-pointer w-fit">
                            Room:
                            <span className="underline">{roomCode}</span>
                            <CopyIcon />
                        </h1>
                        {!isRoomOpen ? (
                            <span className="bg-red-500 text-white text-xs rounded-2xl px-2 py-1 min-w-16">
                                closed
                            </span>
                        ) : (
                            <span className="bg-green-700 text-white text-xs rounded-2xl px-2 p-1 min-w-16">
                                open
                            </span>
                        )}

                        <span className="bg-zinc-200 text-zinc-700 text-xs rounded-2xl px-2 py-1 min-w-16">
                            {props.onlineUsers} users online
                        </span>
                    </div>

                    {user.role === "owner" && (
                        <button
                            onClick={handleToggleRoomStatus}
                            className={`text-sm sm:text-base ${
                                isRoomOpen ? "bg-red-500" : "bg-green-700"
                            } rounded-lg text-white px-4 py-2`}>
                            {isRoomOpen ? "Close" : "Open"}
                        </button>
                    )}
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

                <ChatForm
                    onSendMessage={handleOnSendMessage}
                    isRoomOpen={isRoomOpen}
                />
            </div>
        </div>
    );
};

export default Room;
