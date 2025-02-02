"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msgpack_1 = require("@msgpack/msgpack");
/**
 * Handles the event when a user joins a room.
 *
 * @param socket - The socket instance for the user.
 * @param roomCode - The room code the user wants to join.
 * @param username - The username of the user joining the room.
 * @param io - The socket.io server instance to emit events.
 */
const handleJoinRoom = (socket, roomCode, username, io) => {
    // Join the user to the specified room
    socket.join(roomCode);
    console.log(`SERVER: User ${username} joined room ${roomCode}`);
    // Create a message to notify others that a user joined
    const message = (0, msgpack_1.encode)({
        sender: "Server",
        msg: `${username} joined the room`,
    });
    // Broadcast the message to everyone in the room except the sender
    io.to(roomCode).emit("user_joined", message);
};
exports.default = handleJoinRoom;
