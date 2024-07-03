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

    async send(cmd_type: number, body: Uint8Array): Promise<void> {
        const netPacket: NetPacket = new NetPacket(cmd_type, new Uint8Array, body)
        const payloadBuffer = netPacket.build();
        this.clientSocket.write(payloadBuffer);
    
    }
    
    async send_empty(cmd_type: number): Promise<void> {
        const netPacket: NetPacket = new NetPacket(cmd_type, new Uint8Array, new Uint8Array)
        const payloadBuffer = netPacket.build();
        this.clientSocket.write(payloadBuffer)
    }
}