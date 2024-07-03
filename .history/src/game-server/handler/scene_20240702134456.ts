import { starrail } from "src/proto/starrail";
import { NetSession } from "../NetSession";
import { CmdID } from "src/proto/cmdId";

export async function onGetCurSceneInfoCsReq(
    body: any,
    player: NetSession,
    dataModule: any | null = null
) {
    const scene_info : starrail.SceneInfo = new starrail.SceneInfo()
    scene_info.gameModeType = 1;
    scene_info.planeId = 20101;
    scene_info.floorId = 20101001;
    scene_info.entryId = 2010101;

    { // Character
        const scene_group: starrail.SceneGroupInfo = new starrail.SceneGroupInfo()
        scene_group.state = 1;
        scene_group.entityList.push(new starrail.SceneEntityInfo({
            Actor: {
                baseAvatarId: 1221,
                avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
                uid: 1337,
                mapLayer: 2
            },
            Motion: {
                pos: {
                    x: 32342,
                    y: 192820,
                    z: 434276
                },
                rot: {}
            }
        }))
        scene_info.sceneGroupList.push(scene_group)
    }

    {
        const scene_group: starrail.SceneGroupInfo = new starrail.SceneGroupInfo()
        scene_group.state = 1;
        scene_group.groupId = 19;

        const prop: starrail.ScenePropInfo = new starrail.ScenePropInfo();
        prop.propId = 808;
        prop.propState = 1;

        scene_group.entityList.push(new starrail.SceneEntityInfo({
            GroupId: 19,
            InstId: 300001,
            EntityId: 1337,
            Prop: prop,
            Motion: {
                pos: {
                    x: -570,
                    y: 19364,
                    z: 4480
                },
                rot: {}
            }
        }))

        scene_info.sceneGroupList.push(scene_group)
    }
    const proto: starrail.GetCurSceneInfoScRsp = new starrail.GetCurSceneInfoScRsp({
        retcode: 0,
        scene: scene_info
    })
    const bufferData = starrail.GetCurSceneInfoScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurSceneInfoScRsp, bufferData);
}

export async function onSceneEntityMoveCsReq(
    body: starrail.SceneEntityMoveCsReq | any,
    player: NetSession,
    dataModule: any | null = null
) {
    for (let i = 0; i < body.entityMotionList.length; i++) {
        if (body.entityMotionList[i].motion) {
            console.log(`[POSITION] entity_id: ${body.entityMotionList[i].entityId}, motion: ${body.entityMotionList[i].motion}}`)
        }
    }  
    const proto: starrail.SceneEntityMoveScRsp = new starrail.SceneEntityMoveScRsp({
        retcode: 0,
        entityMotionList: body.entityMotionList,
        downloadData: null
    })
    const bufferData = starrail.SceneEntityMoveScRsp.encode(proto).finish()
    await player.send(CmdID.CmdSceneEntityMoveScRsp, bufferData)
}