"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msgpack_1 = require("@msgpack/msgpack");
/**
 * Handles incoming messages from users within a room.
 *
 * @param socket - The socket instance of the user sending the message.
 * @param roomCode - The room code where the message is sent.
 * @param message - The message content sent by the user.
 * @param sender - The username of the sender.
 * @param io - The socket.io server instance to emit events.
 */
const handleMessage = (socket, roomCode, message, sender, io) => {
    console.log(`SERVER: New message from ${sender} in room ${roomCode}`);
    // Create a message object to send to other users in the room
    const messageData = (0, msgpack_1.encode)({ sender, msg: message });
    // Broadcast the message to everyone in the room except the sender
    io.to(roomCode).emit("message", messageData);
};
exports.default = handleMessage;
