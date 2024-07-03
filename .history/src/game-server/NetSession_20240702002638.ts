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
import { starrail } from "src/proto/starrail";

type HandlerFunction = (
    body: any,
    player: NetSession,
    dataModule: any | null
) => Promise<void>;

type CommandPair = {
    req: number;
    rsp: number;
};

type HandlerPair = {
    cmdID: number;
    action: HandlerFunction;
};

export class NetSession {
    private socketClient: Socket;
    private HandlerList: HandlerPair[];
    private DummyList: CommandPair[];
    private TypeList = {
        58 : starrail.Pl
    }
    constructor(socketClient: Socket) {
        this.socketClient = socketClient;
        this.HandlerList = [
            { cmdID: CmdID.CmdPlayerGetTokenCsReq, action: onPlayerGetTokenCsReq },
            { cmdID: CmdID.CmdPlayerLoginCsReq, action: onPlayerLoginCsReq },
            { cmdID: CmdID.CmdPlayerHeartBeatCsReq, action: onPlayerHeartBeatCsReq },
            { cmdID: CmdID.CmdGetAvatarDataCsReq, action: onGetAvatarDataCsReq },
            { cmdID: CmdID.CmdGetMultiPathAvatarInfoCsReq, action: onGetMultiPathAvatarInfoCsReq },
            { cmdID: CmdID.CmdGetMissionStatusCsReq, action: onGetMissionStatusCsReq },
            // { cmdID: CmdID.CmdGetCurLineupDataCsReq, action: onGetCurLineupData },
            { cmdID: CmdID.CmdGetCurSceneInfoCsReq, action: onGetCurSceneInfoCsReq },
            { cmdID: CmdID.CmdSceneEntityMoveCsReq, action: onSceneEntityMoveCsReq },
            // { cmdID: CmdID.CmdStartCocoonStageCsReq, action: onStartCocoonStage },
            // { cmdID: CmdID.CmdPVEBattleResultCsReq, action: onPVEBattleResult }
            // Add other command-action pairs as needed
          ];
        this.DummyList = [
            { req: CmdID.CmdGetBasicInfoCsReq, rsp: CmdID.CmdGetBasicInfoScRsp },
            { req: CmdID.CmdGetMultiPathAvatarInfoCsReq, rsp: CmdID.CmdGetMultiPathAvatarInfoScRsp },
            { req: CmdID.CmdGetBagCsReq, rsp: CmdID.CmdGetBagScRsp },
            { req: CmdID.CmdGetMarkItemListCsReq, rsp: CmdID.CmdGetMarkItemListScRsp },
            { req: CmdID.CmdGetPlayerBoardDataCsReq, rsp: CmdID.CmdGetPlayerBoardDataScRsp },
            { req: CmdID.CmdGetCurAssistCsReq, rsp: CmdID.CmdGetCurAssistScRsp },
            { req: CmdID.CmdGetAllLineupDataCsReq, rsp: CmdID.CmdGetAllLineupDataScRsp },
            { req: CmdID.CmdGetAllServerPrefsDataCsReq, rsp: CmdID.CmdGetAllServerPrefsDataScRsp },
            { req: CmdID.CmdGetActivityScheduleConfigCsReq, rsp: CmdID.CmdGetActivityScheduleConfigScRsp },
            { req: CmdID.CmdGetMissionDataCsReq, rsp: CmdID.CmdGetMissionDataScRsp },
            { req: CmdID.CmdGetMissionEventDataCsReq, rsp: CmdID.CmdGetMissionEventDataScRsp },
            { req: CmdID.CmdGetQuestDataCsReq, rsp: CmdID.CmdGetQuestDataScRsp },
            { req: CmdID.CmdGetCurChallengeCsReq, rsp: CmdID.CmdGetCurChallengeScRsp },
            { req: CmdID.CmdGetRogueCommonDialogueDataCsReq, rsp: CmdID.CmdGetRogueCommonDialogueDataScRsp },
            { req: CmdID.CmdGetRogueInfoCsReq, rsp: CmdID.CmdGetRogueInfoScRsp },
            { req: CmdID.CmdGetRogueHandbookDataCsReq, rsp: CmdID.CmdGetRogueHandbookDataScRsp },
            { req: CmdID.CmdGetRogueEndlessActivityDataCsReq, rsp: CmdID.CmdGetRogueEndlessActivityDataScRsp },
            { req: CmdID.CmdChessRogueQueryCsReq, rsp: CmdID.CmdChessRogueQueryScRsp },
            { req: CmdID.CmdRogueTournQueryCsReq, rsp: CmdID.CmdRogueTournQueryScRsp },
            { req: CmdID.CmdSyncClientResVersionCsReq, rsp: CmdID.CmdSyncClientResVersionScRsp },
            { req: CmdID.CmdDailyFirstMeetPamCsReq, rsp: CmdID.CmdDailyFirstMeetPamScRsp },
            { req: CmdID.CmdGetBattleCollegeDataCsReq, rsp: CmdID.CmdGetBattleCollegeDataScRsp },
            { req: CmdID.CmdGetNpcStatusCsReq, rsp: CmdID.CmdGetNpcStatusScRsp },
            { req: CmdID.CmdGetSecretKeyInfoCsReq, rsp: CmdID.CmdGetSecretKeyInfoScRsp },
            { req: CmdID.CmdGetHeartDialInfoCsReq, rsp: CmdID.CmdGetHeartDialInfoScRsp },
            { req: CmdID.CmdGetVideoVersionKeyCsReq, rsp: CmdID.CmdGetVideoVersionKeyScRsp },
            { req: CmdID.CmdGetCurBattleInfoCsReq, rsp: CmdID.CmdGetCurBattleInfoScRsp },
            { req: CmdID.CmdHeliobusActivityDataCsReq, rsp: CmdID.CmdHeliobusActivityDataScRsp },
            { req: CmdID.CmdGetEnteredSceneCsReq, rsp: CmdID.CmdGetEnteredSceneScRsp },
            { req: CmdID.CmdGetAetherDivideInfoCsReq, rsp: CmdID.CmdGetAetherDivideInfoScRsp },
            { req: CmdID.CmdGetMapRotationDataCsReq, rsp: CmdID.CmdGetMapRotationDataScRsp },
            { req: CmdID.CmdGetRogueCollectionCsReq, rsp: CmdID.CmdGetRogueCollectionScRsp },
            { req: CmdID.CmdGetRogueExhibitionCsReq, rsp: CmdID.CmdGetRogueExhibitionScRsp },
            { req: CmdID.CmdPlayerReturnInfoQueryCsReq, rsp: CmdID.CmdPlayerReturnInfoQueryScRsp },
            { req: CmdID.CmdPlayerLoginFinishCsReq, rsp: CmdID.CmdPlayerLoginFinishScRsp },
            { req: CmdID.CmdGetLevelRewardTakenListCsReq, rsp: CmdID.CmdGetLevelRewardTakenListScRsp },
            { req: CmdID.CmdGetMainMissionCustomValueCsReq, rsp: CmdID.CmdGetMainMissionCustomValueScRsp }
        ];
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
        const handlerFind = this.HandlerList.find(handler => handler.cmdID == cmd_type);
        if (handlerFind) {

            await handlerFind.action(payload, this);
        }
        const cmdFind = this.DummyList.find(handler => handler.req == cmd_type);
        if (cmdFind) {
            await this.send_empty(cmdFind.rsp);
        }
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