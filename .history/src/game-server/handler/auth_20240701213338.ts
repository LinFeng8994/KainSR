import { starrail } from 'src/proto/starrail';
import Long from 'long';

export async function onPlayerGetTokenCsReq( 
    body: starrail.PlayerGetTokenCsReq | any, 
    dataModule: DataService| null = null,
    gameModule: GameserverService | null = null
) {

    const proto: starrail.PlayerGetTokenScRsp = new starrail.PlayerGetTokenScRsp({
        retcode: 0,
        msg: "OK",
        uid: 1334,
      });

    // const buffer = this.dataService.decodeMessageToBuffer("PlayerGetTokenScRsp", proto);
    const bufferData = starrail.PlayerGetTokenScRsp.encode(proto).finish()

    await this.gameService.send(CMD_PLAYER_GET_TOKEN_SC_RSP, bufferData);
}

export async function onPlayerLoginCsReq(
    body: starrail.PlayerLoginCsReq | any,
    dataModule: DataService| null = null,
    gameModule: GameserverService | null = null
): Promise<void> {
    if (!this.dataService) {
        this.dataService = dataModule
    }
    if (!this.gameService) {
        this.gameService = gameModule
    }
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
    // const buffer = this.dataService.decodeMessageToBuffer("PlayerLoginScRsp", proto);
    const bufferData = starrail.PlayerLoginScRsp.encode(proto).finish()

    await this.gameService.send(CMD_PLAYER_LOGIN_SC_RSP, bufferData);
}
