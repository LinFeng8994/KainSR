import { Injectable } from '@nestjs/common';
import { Socket } from 'net';

@Injectable()
export class GameServerService {
    private player :  NetSesss
    constructor() {}
    handleConnection(socket: Socket): void {
        // this.clientSocket = socket;
        const player
        // this.run().catch((err) => {
        //     console.error('Error handling session:', err);
        // });
    }
}
