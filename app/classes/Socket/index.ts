import dgram from "dgram";

import envConfig from "../../../config/envConfig"; // config

export default class Socket {
  private socket: dgram.Socket;

  constructor() {
    this.socket = dgram.createSocket("udp4");

    // Bind the socket to the local port (4000 in this case; can be configurable, change config file)
    this.socket.bind(envConfig.LOCAL_PORT);
  }

  // PUBLIC METHODS

  /**
   * Export instance of udp socket.
   */
  public get socketInstance(): dgram.Socket {
    return this.socket;
  }
}
