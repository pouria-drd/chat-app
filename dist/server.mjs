import next from "next";
import { Server } from "socket.io";
import { createServer } from "node:http";
const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";
const app = next({ dev, hostname, port, turbopack: true });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer((req, res) => handle(req, res));
    const io = new Server(httpServer, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on("join-room", ({ roomCode, username }) => {
            socket.join(roomCode);
            console.log(`User ${username} joined room ${roomCode}`);
            socket.to(roomCode).emit("user_joined", {
                sender: "Server",
                msg: `${username} joined the room`,
            });
        });
        socket.on("message", ({ roomCode, message, sender }) => {
            console.log(`Message from ${sender} in room ${roomCode}: ${message}`);
            io.to(roomCode).emit("message", { sender, msg: message });
        });
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    httpServer.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});
