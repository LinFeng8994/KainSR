


export async function onGetCurSceneInfoCsReq(
    body: st | any, 
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