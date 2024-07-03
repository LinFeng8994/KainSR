import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';


export async function onGetFriendListInfoCsReq(
    body: any,
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {
    const proto: starrail.GetFriendListInfoScRsp = new starrail.GetFriendListInfoScRsp({
        retcode: 0,
        friendInfoList: []
    })

    const simpleFriend : starrail.MOAJBLNMOGO = new starrail.MOAJBLNMOGO({
        playerSimpleInfo: {
            nickname: "FireFly",
            level: 70,
            uid: 13341334,
            assistSimpleInfoList: [{
                AvatarId: 1310,
                Level: 80,
                DressedSkinId: 0,
                Pos: 0
            }],
            platform: starrail.PlatformType.PC,
            onlineStatus: starrail.FriendOnlineStatus.FRIEND_ONLINE_STATUS_ONLINE
        }
    })

    proto.
    const bufferData = starrail.GetFriendListInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdPVEBattleResultScRsp, bufferData);
}

export async function onPVEBattleResultCsReq(
    body: any,
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {
    const proto: starrail.PVEBattleResultScRsp = new starrail.PVEBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    })
    const bufferData = starrail.PVEBattleResultScRsp.encode(proto).finish()
    await player.send(CmdID.CmdPVEBattleResultScRsp, bufferData);
}