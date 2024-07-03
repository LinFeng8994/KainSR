
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import Long from "long";

export async function onPlayerHeartBeatCsReq(
    body: starrail.PlayerHeartBeatCsReq | any,
    player: NetSession,
    dataModule: any | null = null
): Promise<void> {

    const base64_string = "CS.UnityEngine.GameObject.Find("UIRoot/AboveDialog/BetaHintDialog(Clone)"):GetComponentInChildren(typeof(CS.RPG.Client.LocalizedText)).text = "<color=#00FFFF><b>KainSR</b></color>"
CS.UnityEngine.GameObject.Find("VersionText"):GetComponentInChildren(typeof(CS.RPG.Client.LocalizedText)).text = "<color=#FF1493>2.3.5X_Firefly Lover</color>"";
    const bytesDecode = new Uint8Array(Buffer.from(base64_string, 'base64'));
    const proto: starrail.PlayerHeartBeatScRsp = new starrail.PlayerHeartBeatScRsp({
        // downloadData:{
        //     version: 51,
        //     time: new Long(new Date().getTime()),
        //     data: bytesDecode,
        // },
        serverTimeMs: new Long(new Date().getTime()),
        retcode: 0,
        clientTimeMs: body.clientTimeMs,
    });
    
    const bufferData = starrail.PlayerHeartBeatScRsp.encode(proto).finish()

    await player.send(
        CmdID.CmdPlayerHeartBeatScRsp,
        bufferData
    );
}
