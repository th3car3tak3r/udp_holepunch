declare module "stun" {
  interface StunResponse {
    getXorAddress(): { address: string; port: number };
  }

  interface StunOptions {
    socket: any;
  }

  function request(
    server: string,
    options: StunOptions,
    callback: (err: Error | null, res: StunResponse) => void
  ): void;
}
