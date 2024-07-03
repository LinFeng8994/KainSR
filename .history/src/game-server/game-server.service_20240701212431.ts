import { Injectable } from '@nestjs/common';
import { Socket } from 'net';

@Injectable()
export class GameServerService {
    private player :  NetSession;
    constructor() {}
    handleConnection(socket: Socket): void {
        // this.clientSocket = socket;
        this.player = new Nes
        // this.run().catch((err) => {
        //     console.error('Error handling session:', err);
        // });
    }
}
