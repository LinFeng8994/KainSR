import { Socket } from "net";

export class NetSession {
    private socketClient: Socket;

    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
    }

    async run() {
        
    }

}