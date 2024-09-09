"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextReader_1 = __importDefault(require("./app/classes/TextReader"));
const Socket_1 = __importDefault(require("./app/classes/Socket"));
const Connection_1 = __importDefault(require("./app/classes/Connection"));
const envConfig_1 = __importDefault(require("./config/envConfig")); // config
// Main function to run the P2P messaging app
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = new Socket_1.default();
        // STUN connection setup
        const stunConn = new Connection_1.default(socket.socketInstance, envConfig_1.default.STUN_ADDRESS, envConfig_1.default.STUN_PORT, 5000);
        // Open STUN connection
        stunConn.open((res) => {
            const { address, port } = res.getXorAddress();
            console.log("Change settings in /config/envConfig.json");
            console.log("--------------------");
            console.log("PUBLIC IP:", address);
            console.log("PUBLIC PORT:", port);
            console.log("--------------------\n");
            console.log(`Connected to ${envConfig_1.default.STUN_ADDRESS}:${envConfig_1.default.STUN_PORT}\n`);
        });
        // Peer connection setup
        const peerConn = new Connection_1.default(socket.socketInstance, envConfig_1.default.TARGET_ADDRESS, envConfig_1.default.TARGET_PORT, 5000);
        // Open peer connection
        peerConn.open(() => {
            console.log("Peer connection established.");
        });
        // Listen for incoming messages
        peerConn.listen((dataPacket) => {
            const { username, timestamp, payload } = dataPacket;
            console.log(`${username}@${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()} - ${payload}`);
        });
        // Continuously read user input and send messages
        while (true) {
            const result = yield TextReader_1.default.listen();
            if (typeof result === "string") {
                peerConn.sendMessage({
                    username: envConfig_1.default.username,
                    type: "MESSAGE",
                    timestamp: new Date(),
                    payload: result,
                });
            }
        }
    });
}
// Start the app
Main();
