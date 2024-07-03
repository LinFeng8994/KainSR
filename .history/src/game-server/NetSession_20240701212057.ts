import { Socket } from "net";

export class NetSession {
    private socketClient: Socket;

    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
    }

    async run() {
        while (true) {
            const netPacket = await NetPacket.read(this.clientSocket);
            if (!netPacket) {
                console.log('Received incomplete data from socket');
                continue;
            }
            await this.onMessage(netPacket.cmdId, netPacket.body);
        }
    }

}