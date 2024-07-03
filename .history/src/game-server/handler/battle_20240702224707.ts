import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { AvatarJson, JsonData } from 'src/data/loadData';

export async function onPveBattleResultCsReq(
    body: starrail.PveBattleResultCsReq | any, 
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {

    const proto : starrail.PveBattleResultScRsp = new starrail.PveBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    }) 

    const bufferData = starrail.PveBattleResultScRsp.encode(proto).finish()


    await player.send(CmdID.CmdGetAllLineupDataScRsp, bufferData);
}