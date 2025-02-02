interface MessageProps {
    message: string;
    sender: User | "Server";
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
                        ? `bg-stone-200 text-zinc-700 text-center
                        shadow text-xs underline font-bold px-2 py-1`
                        : isOwnMessage
                        ? `bg-gradient-to-b from-zinc-500 to-zinc-800 text-white
                        rounded-lg shadow-xl min-w-60 px-4 py-2 `
                        : `bg-gradient-to-b from-indigo-100 to-indigo-200 text-black
                        rounded-lg shadow-xl min-w-60 px-4 py-2 `
                }
                max-w-md space-y-2`}>
                {!isServerMessage && (
                    <p className="text-sm sm:text-base flex items-center justify-between font-bold w-full">
                        <span>{sender.username}</span>
                        <span className="text-zinc-400 text-xs">
                            {sender.role === "owner"
                                ? "[owner]"
                                : sender.role === "admin"
                                ? "[admin]"
                                : ""}
                        </span>
                    </p>
                )}
                <p className="text-xs sm:text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Message;
