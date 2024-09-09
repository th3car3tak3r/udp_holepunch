import stun from "stun";
import dgram from "dgram";

//TYPES
import { DataPacket } from "../../../@types/DataPacket";

export default class Connection {
  private socket: dgram.Socket;
  private targetAddress: string;
  private targetPort: number;
  private keepAliveInterval: number;
  private keepAliveTimeout: NodeJS.Timeout | null = null;

  constructor(
    socket: dgram.Socket,
    targetAddress: string,
    targetPort: number,
    keepAliveInterval: number
  ) {
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
  public open(callback: (res: stun.StunResponse) => void): void {
    this.sendUdpRequest(callback);

    // Start keep-alive process
    if (this.keepAliveInterval > 0) {
      this.startKeepAlive();
    }
  }

  /**
   * Close the connection and stop the keep-alive process.
   */
  public close(): void {
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
  public sendMessage(message: DataPacket): void {
    const msgBuffer = Buffer.from(JSON.stringify(message));
    this.socket.send(
      msgBuffer,
      0,
      msgBuffer.length,
      this.targetPort,
      this.targetAddress,
      (err) => {
        if (err) console.error("Error sending message:", err);
      }
    );
  }

  /**
   * Listen for messages sent using the UDP socket.
   */
  public listen(callback: (dataPacket: DataPacket) => void): void {
    this.socket.on("message", (msg, rinfo) => {
      const decodedMessage = msg.toString("utf-8");
      try {
        const DataPacket: DataPacket = JSON.parse(decodedMessage);
        callback(DataPacket);
      } catch (e) {}
    });
  }

  // PRIVATE METHODS

  /**
   * Sends a UDP request and calls the provided callback with the response.
   */
  private sendUdpRequest(callback: (res: stun.StunResponse) => void): void {
    stun.request(
      `${this.targetAddress}:${this.targetPort}`,
      { socket: this.socket },
      (err: any, res: stun.StunResponse) => {
        if (err) {
          console.error("UDP request error:", err);
        } else {
          callback(res);
        }
      }
    );
  }

  /**
   * Starts the keep-alive process, sending STUN requests at regular intervals.
   */
  private startKeepAlive(): void {
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
