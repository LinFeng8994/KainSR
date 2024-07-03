import { starrail } from "src/proto/starrail";
import { NetSession } from "../NetSession";
import { CmdID } from "src/proto/cmdId";



export async function onGetCurSceneInfoCsReq(
    body: starrail.SceneInfo | any, 
    player: NetSession,
    dataModule: any | null = null
) {
    const proto: starrail.GetMultiPathAvatarInfoScRsp = new starrail.GetMultiPathAvatarInfoScRsp({
        curMultiPathAvatarTypeMap: {
            "1001": starrail.MultiPathAvatarType.Mar_7thRogueType
        }
    })
    const bufferData = starrail.GetMultiPathAvatarInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetMultiPathAvatarInfoScRsp, bufferData);
}