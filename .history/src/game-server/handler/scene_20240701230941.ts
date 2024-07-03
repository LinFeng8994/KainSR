
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import Long from "long";

export async function onPlayerHeartBeatCsReq(
    body: starrail.PlayerHeartBeatCsReq | any,
    player: NetSession,
    dataModule: any | null = null
): Promise<void> {

    // const downloadDataBuffer = Buffer.from("Q1MuUlBHLkNsaWVudC5Db25maXJtRGlhbG9nVXRpbC5TaG93Q3VzdG9tT2tDYW5jZWxIaW50KCI8Yj48Y29sb3I9XCIjMDBCRkZGXCI+S2FpblNSPC9jb2xvcj48L2I+Iik=", 'base64');
    const base64_string = "Q1MuUlBHLkNsaWVudC5Db25maXJtRGlhbG9nVXRpbC5TaG93Q3VzdG9tT2tDYW5jZWxIaW50KCI8Yj48Y29sb3I9XCIjMDBCRkZGXCI+S2FpblNSPC9jb2xvcj48L2I+Iik=";
    const buffer = Buffer.from(base64_string, 'base64');
    const bytes = new Uint8Array(buffer);
    const proto: starrail.PlayerHeartBeatScRsp = new starrail.PlayerHeartBeatScRsp({
        downloadData: {
            version: 51,
            time: new Long(new Date().getTime()),
            data: bytes,
        },
        serverTimeMs: new Long(new Date().getTime()),
        retcode: 0,
        clientTimeMs: body.clientTimeMs,
    });
    // const bufferData = this.dataService.decodeMessageToBuffer("PlayerHeartBeatScRsp", proto);
    const bufferData = starrail.PlayerHeartBeatScRsp.encode(proto).finish()

    await this.gameService.send(
        CmdID.CmdPlayerHeartBeatScRsp,
        bufferData
    );
}
