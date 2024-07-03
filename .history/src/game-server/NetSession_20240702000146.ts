import { Socket } from "net";
import { NetPacket } from "./NetPacket";
import { CmdID } from "src/proto/cmdId";

export class NetSession {
    private socketClient: Socket;
    private HandlerList = {
         CmdID.CmdPlayerGetTokenCsReq: onPlayerGetTokenCsReq ,
         CmdID.CmdPlayerLoginCsReq: onPlayerLoginCsReqCsReq ,
         CmdID.CmdPlayerHeartBeatCsReq: onPlayerHeartBeat ,
         CmdID.CmdGetAvatarDataCsReq: onGetAvatarData ,
         CmdID.CmdGetMultiPathAvatarInfoCsReq: onGetMultiPathAvatarInfo ,
         CmdID.CmdGetMissionStatusCsReq: onGetMissionStatus ,
         CmdID.CmdGetCurLineupDataCsRe:, onGetCurLineupData ,
         CmdID.CmdGetCurSceneInfoCsReq: onGetCurSceneInfo ,
         CmdID.CmdSceneEntityMoveCsReq: onSceneEntityMove ,
         CmdID.CmdStartCocoonStageCsReq: onStartCocoonStage ,
         CmdID.CmdPVEBattleResultCsReq: onPVEBattleResult ,
    };
    
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
        this.socketClient.write(payloadBuffer);
    }
    
    async send_empty(cmd_type: number): Promise<void> {
        const netPacket: NetPacket = new NetPacket(cmd_type, new Uint8Array, new Uint8Array)
        const payloadBuffer = netPacket.build();
        this.socketClient.write(payloadBuffer)
    }
}