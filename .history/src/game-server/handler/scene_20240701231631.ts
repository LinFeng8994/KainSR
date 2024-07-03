
import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import Long from "long";

export async function onPlayerHeartBeatCsReq(
    body: starrail.PlayerHeartBeatCsReq | any,
    player: NetSession,
    dataModule: any | null = null
): Promise<void> {

    const base64_string = "CDMQuQoa1AFDUy5Vbml0eUVuZ2luZS5HYW1lT2JqZWN0LkZpbmQoIlVJUm9vdC9BYm92ZURpYWxvZy9CZXRhSGludERpYWxvZyhDbG9uZSkiKTpHZXRDb21wb25lbnRJbkNoaWxkcmVuKHR5cGVvZihDUy5SUEcuQ2xpZW50LkxvY2FsaXplZFRleHQpKS50ZXh0ID0gIll1bmxpU1IgaXMgYSBmcmVlIGFuZCBvcGVuIHNvdXJjZSBzb2Z0d2FyZS4gZGlzY29yZC5nZy9yZXZlcnNlZHJvb21zIg==";
    const bytesDecode = new Uint8Array(Buffer.from(base64_string, 'base64'));
    const dataDownload : starrail.ClientDownloadData = new starrail.ClientDownloadData(
        {
            version: 51,
            time: new Long(new Date().getTime()),
            data: bytesDecode,
        },
    )
    const bytesDataDownload = 
    const proto: starrail.PlayerHeartBeatScRsp = new starrail.PlayerHeartBeatScRsp({
        downloadData:
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
