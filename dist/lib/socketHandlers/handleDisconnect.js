"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handles user disconnection.
 *
 * @param socket - The socket instance of the disconnected user.
 */
const handleDisconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
};
exports.default = handleDisconnect;
