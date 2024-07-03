import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { NetSession } from "./NetSession"

@Injectable()
export class GameServerService {
    private player :  NetSession;
    constructor(
        private dataService : D
    ) {}

    handleConnection(socket: Socket): void {
        this.player = new NetSession(socket);
        this.player.run().catch((err) => {
            console.error('Error handling session:', err);
        });
    }
}
