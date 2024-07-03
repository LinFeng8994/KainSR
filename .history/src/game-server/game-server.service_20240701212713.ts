import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { NetSession } from "./NetSession"

@Injectable()
export class GameServerService {
    private player :  NetSession;
    constructor() {}
    
    handleConnection(socket: Socket): void {
        // this.clientSocket = socket;
        this.player = new NetSession(socket);
        this.player.run().catch((err) => {
            console.error('Error handling session:', err);
        });
    }
}
