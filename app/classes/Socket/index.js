"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const envConfig_1 = __importDefault(require("../../../config/envConfig")); // config
class Socket {
    constructor() {
        this.socket = dgram_1.default.createSocket("udp4");
        // Bind the socket to the local port (4000 in this case; can be configurable, change config file)
        this.socket.bind(envConfig_1.default.LOCAL_PORT);
    }
    // PUBLIC METHODS
    /**
     * Export instance of udp socket.
     */
    get socketInstance() {
        return this.socket;
    }
}
exports.default = Socket;
