
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';

export async function onGetCurLineupDataScRsp (
    body: any, 
    player: NetSession,
    dataModule: any | null = null
){
    const avatar : starrail.LineupAvatar = new starrail.LineupAvatar({
        id: 1221,
        slot
    })
}