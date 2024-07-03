import { Socket } from "net";
import { NetPacket } from "./NetPacket";
import { CmdID } from "src/proto/cmdId";
import { 
    onPlayerGetTokenCsReq, 
    onPlayerLoginCsReq, 
    onPlayerHeartBeatCsReq,
    onGetAvatarDataCsReq,
    onGetMultiPathAvatarInfoCsReq,
    onGetMissionStatusCsReq,
    onGetCurSceneInfoCsReq,
    onSceneEntityMoveCsReq
 } from "./handler"

type HandlerFunction = (    
    body: starrail.SceneInfo | any,
    player: NetSession,
    dataModule: any | null = null
) => void;

export class NetSession {
    private socketClient: Socket;
    private HandlerList: { [key: number]: Function };

    
    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
        this.HandlerList = {
            [CmdID.CmdPlayerGetTokenCsReq]: onPlayerGetTokenCsReq ,
            [CmdID.CmdPlayerLoginCsReq]: onPlayerLoginCsReq ,
            [CmdID.CmdPlayerHeartBeatCsReq]: onPlayerHeartBeatCsReq ,
            [CmdID.CmdGetAvatarDataCsReq]: onGetAvatarDataCsReq,
            [CmdID.CmdGetMultiPathAvatarInfoCsReq]: onGetMultiPathAvatarInfoCsReq,
            [CmdID.CmdGetMissionStatusCsReq]: onGetMissionStatusCsReq  ,
           //  CmdID.CmdGetCurLineupDataCsRe: onGetCurLineupData ,
            [CmdID.CmdGetCurSceneInfoCsReq]: onGetCurSceneInfoCsReq ,
            [CmdID.CmdSceneEntityMoveCsReq]: onSceneEntityMoveCsReq,
           //  CmdID.CmdStartCocoonStageCsReq: onStartCocoonStage ,
           //  CmdID.CmdPVEBattleResultCsReq: onPVEBattleResult ,
          };
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