import { Socket } from "net";
import { NetPacket } from "./NetPacket";

export class NetSession {
    private socketClient: Socket;

    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
    }

    public async run() {
        while (true) {
            const netPacket = await NetPacket.read(this.socketClient);
            if (!netPacket) {
                console.log('Received incomplete data from socket');
                continue;
            }
            await this.onMessage(netPacket.cmdId, netPacket.body);
        }
    }

    private async onMessage(cmd_type: number, payload: Uint8Array): Promise<void> {

    }

    public async send
}