"use client";

import { useState } from "react";
import { SendIcon } from "@/components/icons";

interface ChatFormProps {
    onSendMessage: (message: string) => void;
}

const ChatForm = (props: ChatFormProps) => {
    const [message, setMessage] = useState<string>("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim() === "") return;
        props.onSendMessage(message);
        setMessage("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-200 bg-opacity-90 rounded-t-xl flex gap-2 glass sticky bottom-0 z-10 px-4 pb-3.5 pt-5">
            <input
                type="text"
                value={message}
                placeholder="Enter your message..."
                className="flex-1 rounded-lg text-zinc-700
                selection:bg-zinc-300 selection:text-zinc-700
                border-2 border-zinc-300 focus:border-zinc-400
                focus:outline-none px-4 py-2"
                onChange={(event) => setMessage(event.target.value)}
            />
            <button
                type="submit"
                className="rounded-lg border-2 border-zinc-300 
                bg-zinc-100 hover:bg-zinc-300 text-zinc-700 px-4 py-2">
                <SendIcon />
            </button>
        </form>
    );
};

export default ChatForm;
