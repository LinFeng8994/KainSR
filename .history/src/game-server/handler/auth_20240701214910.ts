import { starrail } from 'src/proto/starrail';
import Long from 'long';
import { NetSession } from "../NetSession"

export async function onPlayerGetTokenCsReq( 
    body: starrail.PlayerGetTokenCsReq | any, 
    player: NetSession
) {

    const proto: starrail.PlayerGetTokenScRsp = new starrail.PlayerGetTokenScRsp({
        retcode: 0,
        msg: "OK",
        uid: 1334,
      });
    const bufferData = starrail.PlayerGetTokenScRsp.encode(proto).finish()

    await player.send(CmdID.CmdPlayerGetTokenScRsp, bufferData);
}

export async function onPlayerLoginCsReq(
    body: starrail.PlayerLoginCsReq | any,
    player: NetSession
): Promise<void> {
    const proto: starrail.PlayerLoginScRsp = new starrail.PlayerLoginScRsp({
        loginRandom: body.loginRandom,
        serverTimestampMs: new Long(new Date().getTime()),
        stamina: 240,
        basicInfo: {
            nickname: "KainSR",
            level: 70,
            worldLevel: 6,
            stamina: 240,

        },
      });
    const bufferData = starrail.PlayerLoginScRsp.encode(proto).finish()

    await player.send(CmdID.CmdPlayerGetTokenScRsp, bufferData);
}
