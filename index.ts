import stun from "stun";
import TextReader from "./app/classes/TextReader";
import Socket from "./app/classes/Socket";
import Connection from "./app/classes/Connection";
import envConfig from "./config/envConfig"; // config

// Main function to run the P2P messaging app
async function Main() {
  const socket = new Socket();

  // STUN connection setup
  const stunConn = new Connection(
    socket.socketInstance,
    envConfig.STUN_ADDRESS,
    envConfig.STUN_PORT,
    5000
  );

  // Open STUN connection
  stunConn.open((res: stun.StunResponse) => {
    const { address, port } = res.getXorAddress();

    console.log("Change settings in /config/envConfig.json");
    console.log("--------------------");
    console.log("PUBLIC IP:", address);
    console.log("PUBLIC PORT:", port);
    console.log("--------------------\n");
    console.log(
      `Connected to ${envConfig.STUN_ADDRESS}:${envConfig.STUN_PORT}\n`
    );
  });

  // Peer connection setup
  const peerConn = new Connection(
    socket.socketInstance,
    envConfig.TARGET_ADDRESS,
    envConfig.TARGET_PORT,
    5000
  );

  // Open peer connection
  peerConn.open(() => {
    console.log("Peer connection established.");
  });

  // Listen for incoming messages
  peerConn.listen((dataPacket) => {
    const { username, timestamp, payload } = dataPacket;
    console.log(
      `${username}@${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()} - ${payload}`
    );
  });

  // Continuously read user input and send messages
  while (true) {
    const result = await TextReader.listen();
    if (typeof result === "string") {
      peerConn.sendMessage({
        username: envConfig.username,
        type: "MESSAGE",
        timestamp: new Date(),
        payload: result,
      });
    }
  }
}

// Start the app
Main();
