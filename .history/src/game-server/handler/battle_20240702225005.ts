import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { AvatarJson, JsonData } from 'src/data/loadData';

export async function onStartCocoonStageCsReq (
    body: starrail.StartCocoonStageCsReq, 
    player: NetSession,
    dataModule: DataService | null = null
) {

}



export async function onPVEBattleResultCsReq(
    body: starrail.PVEBattleResultCsReq, 
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {

    const proto : starrail.PVEBattleResultScRsp = new starrail.PVEBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    }) 
    const bufferData = starrail.PVEBattleResultScRsp.encode(proto).finish()
    await player.send(CmdID.PVEBattleResultScRsp, bufferData);
}