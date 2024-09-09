const stun = require("stun");
const dgram = require("dgram");
const readline = require("readline");

//CONFIG

// Create a UDP socket
const socket = dgram.createSocket("udp4");
var current_port = null;

// Bind the socket to a specific local port (e.g., 4000)
socket.bind(4000, () => {
  console.log(`Socket is bound to local port ${socket.address().port}`);
});

// Function to send the STUN request using the same socket
function sendStunRequest() {
  stun.request("stun.l.google.com:19302", { socket }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      const { address, port } = res.getXorAddress();
      if (current_port !== port) {
        current_port = port;
        console.log("Public IP:", address, "and public port:", port);
      }
    }
  });
}

function sendPeerConnectionRequest() {
  const message = "Hello from the other side";
  socket.send(message, 0, message.length, "4000", "86.172.233.244", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Message sent`);
    }
  });
  /*stun.request("86.172.233.244:4000", { socket }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console("connection successful");
    }
  });*/
}

/*socket.on("message", (msg, rinfo) => {
  const decodedMessage = msg.toString("utf-8");
  if (rinfo.address !== "74.125.250.129") {
    console.log(
      `Received message from ${rinfo.address}:${rinfo.port} - ${decodedMessage}`
    );
  }
});*/

// Send STUN request every 5 seconds
setInterval(() => {
  sendStunRequest();
  sendPeerConnectionRequest();
}, 5000);

// Send the first STUN request immediately
sendStunRequest();
