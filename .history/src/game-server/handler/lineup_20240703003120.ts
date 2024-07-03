import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { GameConfig } from 'src/data/loadConfig';

export async function onGetCurLineupDataCsReq (
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
){
    const jsonData : GameConfig = dataModule.getDataInGame()
    const lineup : starrail.LineupInfo = new starrail.LineupInfo()
    lineup.HPMGGECENEM = 5;
    lineup.HG
    const proto : starrail.GetCurLineupDataScRsp = new starrail.GetCurLineupDataScRsp({
        retcode: 0,
        lineup: lineup
    })

    const bufferData = starrail.GetCurLineupDataScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurLineupDataScRsp, bufferData)
}

export async function onGetAllLineupDataCsReq(
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> 
{
    const jsonData : JsonData = dataModule.getDataInGame()

    const lineup: starrail.LineupInfo = new starrail.LineupInfo({
        extraLineupType: starrail.ExtraLineupType.LINEUP_NONE,
        name: 'Squad 1',
        avatarList: AvatarJson.toLineupAvatars(jsonData),
    });
    const proto: starrail.GetAllLineupDataScRsp = new starrail.GetAllLineupDataScRsp({
        retcode: 0,
        lineupList: [lineup],
    });
    const bufferData = starrail.GetAllLineupDataScRsp.encode(proto).finish()

    await player.send(CmdID.CmdGetAllLineupDataScRsp, bufferData);
}