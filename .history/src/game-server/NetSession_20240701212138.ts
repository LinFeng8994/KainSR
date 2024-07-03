import { Socket } from "net";
import { NetPacket } from "./NetPacket";

export class NetSession {
    private socketClient: Socket;

    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
    }

    async run() {
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
        const command = this.commandList.find(cmd => cmd.cmd_type === cmd_type);

        if (!command) {
            let cmdEmpty = Object.keys(this.inputEmpty).find(key => this.inputEmpty[key] === cmd_type);
            cmdEmpty = cmdEmpty.replace("CsReq", "ScRsp")
            if (this.inputEmpty[cmdEmpty]) {
                console.log(`unknown command: ${cmd_type} to send: ${this.inputEmpty[cmdEmpty]}`)
                await this.send_empty(this.inputEmpty[cmdEmpty])
            }
            else {
                console.log(`unknown type command: ${cmd_type}`) 
            }
            return;
        }        
        console.debug(`Valid Command type ${cmd_type}`);
 
    }

}