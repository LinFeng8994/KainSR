import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { GameConfig } from 'src/data/loadConfig';


export async function onStartCocoonStageCsReq(
    body: starrail.StartCocoonStageCsReq,
    session: NetSession,
    dataModule: DataService | null = null
) {

    
    const jsonData : GameConfig = dataModule.getDataInGame()
    const battle_info: starrail.SceneBattleInfo = new starrail.SceneBattleInfo({
        stageId: jsonData.battle_config.stage_id,
        logicRandomSeed: (Date.now() % 0xFFFFFFFF) >>> 0,
        battleId: 1,
        HOFFCBLNFNG: jsonData.battle_config.cycle_count, 
    });

    
    const proto: starrail.StartCocoonStageScRsp = new starrail.StartCocoonStageScRsp({
        Retcode: 0,
        PropEntityId: body.propEntityId,
        CocoonId: body.cocoonId,
        Wave: body.wave,
        BattleInfo: battle_info,
    });


    const bufferData = starrail.StartCocoonStageScRsp.encode(proto).finish()

    await session.send(CmdID.CmdStartCocoonStageScRsp, bufferData);
}



export async function onPVEBattleResultCsReq(
    body: starrail.PVEBattleResultCsReq,
    player: NetSession,
    dataModule: DataService | null = null
): Promise<void> {
    const proto: starrail.PVEBattleResultScRsp = new starrail.PVEBattleResultScRsp({
        retcode: 0,
        endStatus: body.endStatus,
        battleId: body.battleId,
    })
    const bufferData = starrail.PVEBattleResultScRsp.encode(proto).finish()
    await player.send(CmdID.PVEBattleResultScRsp, bufferData);
}