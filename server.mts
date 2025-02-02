import next from "next";
import { createServer } from "node:http";
import { encode } from "@msgpack/msgpack";
import { Server, Socket } from "socket.io";

// Server configuration variables
const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

// Create the Next.js app
const app = next({ dev, hostname, port, turbopack: true });
const handle = app.getRequestHandler();

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
        socket.on("message", ({ roomCode, message, sender }) => {
            handleMessage(socket, roomCode, message, sender, io); // Use the handler for messages
        });

        // Event listener for user disconnection
        socket.on("disconnect", () => {
            handleDisconnect(socket); // Use the handler for disconnect
        });
    });

    // Start the server and listen for connections
    httpServer.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});

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
    // Join the user to the specified room
    socket.join(roomCode);
    console.log(`SERVER: User ${username} joined room ${roomCode}`);

    // Create a message to notify others that a user joined
    const message = encode({
        sender: "Server",
        msg: `${username} joined the room`,
    });

    // Broadcast the message to everyone in the room except the sender
    io.to(roomCode).emit("user_joined", message);
};

/**
 * Handles user disconnection.
 *
 * @param socket - The socket instance of the disconnected user.
 */

const handleDisconnect = (socket: Socket) => {
    console.log(`User disconnected: ${socket.id}`);
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
    sender: string,
    io: Server
) => {
    console.log(`SERVER: New message from ${sender} in room ${roomCode}`);

    // Create a message object to send to other users in the room
    const messageData = encode({ sender, msg: message });

    // Broadcast the message to everyone in the room except the sender
    io.to(roomCode).emit("message", messageData);
};
