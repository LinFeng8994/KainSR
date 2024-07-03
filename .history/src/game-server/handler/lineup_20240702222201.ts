
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { AvatarJson, JsonData } from 'src/data/loadData';

export async function onGetCurLineupDataCsReq (
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
){
    const jsonData : JsonData = dataModule.getDataInGame()
    const lineup = AvatarJson.toLineupInfo(jsonData.lineups)
    const proto : starrail.GetCurLineupDataScRsp = new starrail.GetCurLineupDataScRsp({
        retcode: 0,
        lineup: lineup
    })

    const bufferData = starrail.GetCurLineupDataScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurLineupDataScRsp, bufferData)
}

async onGetAllLineupDataCsReq(
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {

    const jsonData : JsonData = dataModule.getDataInGame()

    const lineup: starrail.LineupInfo = new starrail.LineupInfo({
        extraLineupType: starrail.ExtraLineupType.LINEUP_NONE,
        name: 'Squad 1',
        mp: 5,
        mpMax: 5,
        avatarList: AvatarJson.toLineupAvatars(player),
    });
    const proto: starrail.GetAllLineupDataScRsp = new starrail.GetAllLineupDataScRsp({
        lineupList: [lineup],
    });
    // const bufferData = this.dataService.decodeMessageToBuffer("GetAllLineupDataScRsp", proto);

    const bufferData = starrail.GetAllLineupDataScRsp.encode(proto).finish()

    await this.gameService.send(CMD_GET_ALL_LINEUP_DATA_SC_RSP, bufferData);
}