import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { decode, encode } from "@msgpack/msgpack";

// Server configuration variables
const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

// Create the Next.js app
const app = next({ dev, hostname, port, turbopack: true });
const handle = app.getRequestHandler();

// Define the storage for rooms and users
export const rooms: Rooms = {};
export const users: Users = {};

/**
 * Starts the server and sets up socket.io connections.
 *
 * @returns void
 */
app.prepare().then(() => {
    // Create the HTTP server and attach socket.io
    const httpServer = createServer((req, res) => handle(req, res));
    const io = new Server(httpServer, { cors: { origin: "*" } });

    /**
     * Event handler for a new socket connection.
     *
     * @param socket - The socket instance representing the client.
     */
    io.on("connection", (socket) => {
        console.log(`SERVER: User connected: ${socket.id}`);

        // Event listener for users joining a room
        socket.on("join-room", ({ roomCode, username }) => {
            handleJoinRoom(socket, roomCode, username, io); // Use the handler for joining room
        });

        // Event listener for receiving messages from users
        socket.on("new-message", (data: Buffer) => {
            const decodedData = decode(data) as {
                roomCode: string;
                message: string;
                sender: User | "Server";
            };
            const { roomCode, message, sender } = decodedData;
            handleMessage(socket, roomCode, message, sender, io); // Use the handler for messages
        });

        // Event listener for toggling chat in a room (open/close)
        socket.on("toggle-room-open-status", (data: Buffer) => {
            const decodedData = decode(data) as { roomCode: string };
            const { roomCode } = decodedData;
            handleToggleChat(socket, roomCode, io);
        });

        // Event listener for user disconnection
        socket.on("disconnect", () => {
            handleDisconnect(io, socket); // Use the handler for disconnect
        });
    });

    // Start the server and listen for connections
    httpServer.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});

// Helpers ----------------------------------------------------------------------

/**
 * Handles the event when a user joins a room.
 *
 * @param socket - The socket instance for the user.
 * @param roomCode - The room code the user wants to join.
 * @param username - The username of the user joining the room.
 * @param io - The socket.io server instance to emit events.
 */

const handleJoinRoom = (
    socket: Socket,
    roomCode: string,
    username: string,
    io: Server
) => {
    // Join room and get user info
    const user = joinRoom(roomCode, socket.id, username);

    // Join the user to the specified room
    socket.join(roomCode);
    console.log(
        `SERVER: User ${username} joined room ${roomCode} as ${user.role}`
    );

    // Notify others in the room
    const message = encode({
        sender: "Server",
        msg: `${username} joined the room as ${user.role}`,
    });
    io.to(roomCode).emit("new-user-joined", message);

    // Send updated user count
    io.to(roomCode).emit(
        "update-online-users",
        encode({
            onlineUsers: rooms[roomCode].onlineUsers,
        })
    );

    // Send confirmation back to the user with their username and room code
    socket.emit(
        "joined-success",
        encode({
            user,
            roomCode,
            isRoomOpen: rooms[roomCode].isRoomOpen,
            onlineUsers: rooms[roomCode].onlineUsers,
        })
    );
};

/**
 * Handles user disconnection.
 *
 * @param io - The socket.io server instance.
 * @param socket - The socket instance of the disconnected user.
 */
const handleDisconnect = (io: Server, socket: Socket) => {
    const user = users[socket.id];

    if (!user) return; // User might not exist

    const { username, roomCode } = user;

    if (rooms[roomCode]) {
        rooms[roomCode].onlineUsers = Math.max(
            0,
            rooms[roomCode].onlineUsers - 1
        ); // Ensure it doesn’t go negative

        // Emit updated user count
        io.to(roomCode).emit(
            "update-online-users",
            encode({
                onlineUsers: rooms[roomCode].onlineUsers,
            })
        );
    }

    // Notify other users in the room
    const messageData = encode({
        sender: "Server",
        msg: `${username} left the room`,
    });

    io.to(roomCode).emit("new-message", messageData);
    console.log(`SERVER: User ${username} disconnected from room ${roomCode}`);

    delete users[socket.id]; // Remove user from users list
};

/**
 * Handles incoming messages from users within a room.
 *
 * @param socket - The socket instance of the user sending the message.
 * @param roomCode - The room code where the message is sent.
 * @param message - The message content sent by the user.
 * @param sender - The username of the sender.
 * @param io - The socket.io server instance to emit events.
 */
const handleMessage = (
    socket: Socket,
    roomCode: string,
    message: string,
    sender: User | "Server",
    io: Server
) => {
    if (!rooms[roomCode]?.isRoomOpen) {
        socket.emit("error-message", { msg: "Chat is closed by the owner" });
        return;
    }

    if (sender !== "Server") {
        console.log(
            `SERVER: New message from ${sender.username} in room ${roomCode}`
        );
    }

    // Create a message object to send to other users in the room
    const messageData = encode({ sender, msg: message });

    // Broadcast the message to everyone in the room except the sender
    io.to(roomCode).emit("new-message", messageData);
};

/**
 * Function to handle toggling chat in a room and broadcast the event to other users
 *
 * @param socket - The socket instance of the user who is toggling chat.
 * @param roomCode - The room code where the user is toggling chat.
 * @param io - The socket.io server instance to emit events.
 */
const handleToggleChat = (socket: Socket, roomCode: string, io: Server) => {
    if (rooms[roomCode] && rooms[roomCode].ownerSocketId === socket.id) {
        rooms[roomCode].isRoomOpen = !rooms[roomCode].isRoomOpen;

        io.to(roomCode).emit(
            "is-room-open-status",
            encode({ chatOpen: rooms[roomCode].isRoomOpen })
        );

        // Broadcast the message to everyone in the room is closed or open
        const messageData = encode({
            sender: "Server",
            msg: `Room ${
                rooms[roomCode].isRoomOpen ? "opened" : "closed"
            } by the owner`,
        });
        io.to(roomCode).emit("new-message", messageData);
    }
};

/**
 * Function to handle user joining a room and broadcast the event to other users
 *
 * @param roomCode - The room code the user is joining.
 * @param socketId - The socket ID of the user joining the room.
 * @param username - The username of the user joining the room.
 * @returns The user object with their role.
 */
function joinRoom(roomCode: string, socketId: string, username: string): User {
    // Check if the room already exists
    let userRole: "user" | "admin" | "owner" = "user"; // Default role is user

    if (!rooms[roomCode]) {
        // If room doesn't exist, create the room and assign the first user as owner
        rooms[roomCode] = {
            ownerSocketId: socketId,
            isRoomOpen: true,
            onlineUsers: 0,
        };
        userRole = "owner"; // First user becomes the owner
    }

    rooms[roomCode].onlineUsers += 1; // Increment online users

    // Add user to users object with assigned role
    const user: User = { username, role: userRole, roomCode };
    users[socketId] = user;

    return user;
}

// Types ----------------------------------------------------------------------

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
