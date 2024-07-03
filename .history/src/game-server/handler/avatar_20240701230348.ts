
import { starrail } from 'src/proto/starrail';
import Long from 'long';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';

const UNLOCKED_AVATARS: number[] = [
    8001, 8002, 8003, 8004, 8005, 8006, 1001, 1002, 1003, 1004, 1005, 1006, 1008, 1009, 1013, 1101,
    1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1201, 1202, 1203, 1204, 1205,
    1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1217, 1301, 1302, 1303, 1304, 1305,
    1306, 1307, 1308, 1309, 1312, 1315, 1310, 1314, 1221, 1218,
];

export async function onGetAvatarDataCsReq (
    body: starrail.GetAvatarDataCsReq | any, 
    player: NetSession,
    dataModule: any | null = null
) {
    const avatar_list : starrail.Avatar[] = []

    for (let i = 0; i < UNLOCKED_AVATARS.length; i++) {
        avatar_list.push(new starrail.Avatar({
            baseAvatarId: UNLOCKED_AVATARS[i],
            level: 80,
            promotion: 6,
            rank: 6
        }))
    }

    const proto: starrail.GetAvatarDataScRsp = new starrail.GetAvatarDataScRsp({
        retcode: 0,
        isAll: body.isGetAll,
        avatarList: avatar_list
    });
    // const buffer = this.dataService.decodeMessageToBuffer("GetAvatarDataScRsp", proto);
    const bufferData = starrail.GetAvatarDataScRsp.encode(proto).finish()
    await this.player.send(CmdID.CmdGetAvatarDataScRsp, bufferData);
}

export async function onGetMultiPathAvatarInfoCsReq(
    body: {| any, 
    player: NetSession,
    dataModule: any | null = null
) {
    const proto: starrail.GetMultiPathAvatarInfoScRsp = new starrail.GetMultiPathAvatarInfoScRsp({
        curMultiPathAvatarTypeMap: {
            "1001": starrail.MultiPathAvatarType.Mar_7thRogueType
        }
    })
    const bufferData = starrail.GetMultiPathAvatarInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetAvatarDataScRsp, bufferData);
}