
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';

export async function onGetCurLineupDataCsReq (
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
){
    dataModule.getDataInGame()
    const avatar : starrail.LineupAvatar = new starrail.LineupAvatar({
        id: 1221,
        slot: 0,
        satiety: 0,
        hp: 10000,
        avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
        sp: {
            spCur: 10000,
            spNeed: 10000
        }
    })

    const lineup : starrail.LineupInfo = new starrail.LineupInfo()
    lineup.name = "Squad 1",
    lineup.avatarList.push(avatar);
    const proto : starrail.GetCurLineupDataScRsp = new starrail.GetCurLineupDataScRsp({
        retcode: 0,
        lineup: lineup
    })

    const bufferData = starrail.GetCurLineupDataScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurLineupDataScRsp, bufferData)
}