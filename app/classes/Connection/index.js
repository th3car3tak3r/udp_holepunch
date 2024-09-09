"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stun_1 = __importDefault(require("stun"));
class Connection {
    constructor(socket, targetAddress, targetPort, keepAliveInterval) {
        this.keepAliveTimeout = null;
        this.socket = socket;
        this.targetAddress = targetAddress;
        this.targetPort = targetPort;
        this.keepAliveInterval = keepAliveInterval;
    }
    // PUBLIC METHODS
    /**
     * Open the connection and start the keep-alive process.
     * Calls the provided callback with the STUN response.
     */
    open(callback) {
        this.sendUdpRequest(callback);
        // Start keep-alive process
        if (this.keepAliveInterval > 0) {
            this.startKeepAlive();
        }
    }
    /**
     * Close the connection and stop the keep-alive process.
     */
    close() {
        if (this.keepAliveTimeout) {
            clearTimeout(this.keepAliveTimeout);
            this.keepAliveTimeout = null;
        }
        this.socket.close(() => {
            console.log("Socket closed.");
        });
    }
    /**
     * Send a message using the UDP socket.
     */
    sendMessage(message) {
        const msgBuffer = Buffer.from(JSON.stringify(message));
        this.socket.send(msgBuffer, 0, msgBuffer.length, this.targetPort, this.targetAddress, (err) => {
            if (err)
                console.error("Error sending message:", err);
        });
    }
    /**
     * Listen for messages sent using the UDP socket.
     */
    listen(callback) {
        this.socket.on("message", (msg, rinfo) => {
            const decodedMessage = msg.toString("utf-8");
            try {
                const DataPacket = JSON.parse(decodedMessage);
                callback(DataPacket);
            }
            catch (e) { }
        });
    }
    // PRIVATE METHODS
    /**
     * Sends a UDP request and calls the provided callback with the response.
     */
    sendUdpRequest(callback) {
        stun_1.default.request(`${this.targetAddress}:${this.targetPort}`, { socket: this.socket }, (err, res) => {
            if (err) {
                console.error("UDP request error:", err);
            }
            else {
                callback(res);
            }
        });
    }
    /**
     * Starts the keep-alive process, sending STUN requests at regular intervals.
     */
    startKeepAlive() {
        const keepAlive = () => {
            this.sendUdpRequest((res) => {
                //console.log("Keep-alive STUN response received:", res.getXorAddress());
            });
            // Schedule next keep-alive
            this.keepAliveTimeout = setTimeout(keepAlive, this.keepAliveInterval);
        };
        keepAlive(); // Initial call
    }
}
exports.default = Connection;
