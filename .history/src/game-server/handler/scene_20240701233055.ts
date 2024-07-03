import { starrail } from "src/proto/starrail";
import { NetSession } from "../NetSession";
import { CmdID } from "src/proto/cmdId";



export async function onGetCurSceneInfoCsReq(
    body: starrail.SceneInfo, 
    player: NetSession,
    dataModule: any | null = null
) {
    body.gameModeType = 1;
    body.planeId = 20101;
    body.floorId = 20101001;
    body.entryId = 2010101;
    const proto: starrail.GetMultiPathAvatarInfoScRsp = new starrail.GetMultiPathAvatarInfoScRsp({
        curMultiPathAvatarTypeMap: {
            "1001": starrail.MultiPathAvatarType.Mar_7thRogueType
        }
    })
    const bufferData = starrail.GetMultiPathAvatarInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurSceneInfoScRsp, bufferData);
}