import next from "next";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { handleJoinRoom, handleMessage, handleDisconnect, } from "./lib/socketHandlers";
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
