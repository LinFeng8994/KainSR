
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
        slot: 0,
        satiety: 0,
        hp: 10000,
        avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
        sp: {
            spCur: 10000,
            spNeed: 10000
        }
    })
}