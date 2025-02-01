interface MessageProps {
    message: string;
    sender: string;
    isOwnMessage: boolean;
}

const Message = (props: MessageProps) => {
    const { message, sender, isOwnMessage } = props;
    const isServerMessage = sender === "Server";

    return (
        <div
            className={`flex ${
                isServerMessage
                    ? "justify-center"
                    : isOwnMessage
                    ? "justify-end"
                    : "justify-start"
            } mb-3`}>
            <div
                className={`${
                    isServerMessage
                        ? "text-zinc-700 text-center text-xs underline font-bold"
                        : isOwnMessage
                        ? `bg-gradient-to-b from-zinc-600 to-zinc-800 text-white
                        border border-zinc-800 shadow-lg min-w-60`
                        : `bg-gradient-to-b from-zinc-200 to-zinc-300 text-black
                        border border-zinc-400 shadow-lg min-w-60`
                }
                max-w-md rounded-lg px-4 py-2 space-y-2`}>
                {!isServerMessage && (
                    <p className="text-sm sm:text-base font-bold">{sender}</p>
                )}
                <p className="text-xs sm:text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Message;
