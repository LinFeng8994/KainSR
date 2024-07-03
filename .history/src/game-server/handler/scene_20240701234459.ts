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

   { // Character
        const scene_group : starrail.SceneGroupInfo = new starrail.SceneGroupInfo()
        scene_group.state = 1;
        scene_group.entityList.push(new starrail.SceneEntityInfo({
            Actor : {
                baseAvatarId: 1221,
                
            }
        }))
   }

   {

   }

    const bufferData = starrail.GetMultiPathAvatarInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurSceneInfoScRsp, bufferData);
}