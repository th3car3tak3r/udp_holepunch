const dgram = require("dgram");
const socket = dgram.createSocket("udp4");

// Replace with the other machine's public IP and port
const targetIP = "192.168.1.10"; // Machine 2's public IP
const targetPort = 4000; // Machine 2's public port

const message = Buffer.from("Hello from Machine 2");

// Send a UDP packet
socket.send(message, 0, message.length, targetPort, targetIP, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Message sent to ${targetIP}:${targetPort}`);
  }
  socket.close(); // You can close the socket after sending if you only need to send once
});
