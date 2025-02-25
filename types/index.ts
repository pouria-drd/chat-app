type IconProps = {
    className?: string;
};

type Message = {
    msg: string;
    sender: User | "Server";
};

interface Room {
    isRoomOpen: boolean;
    onlineUsers: number;
    ownerSocketId: string;
}

interface User {
    username: string;
    roomCode: string;
    role: "user" | "admin" | "owner";
}

interface Rooms {
    [roomCode: string]: Room;
}

interface Users {
    [socketId: string]: User;
}
