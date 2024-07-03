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
    const battle : starrail.SceneActorInfo = new starrail.SceneBattleInfo();
    
    // avatar handler
    for (let i = 0; i < jsonData.avatar_config.length; i++) {
        const tmpAvatar : starrail.BattleAvatar = new starrail.BattleAvatar();
        tmpAvatar.id = jsonData.avatar_config[i].id;
        tmpAvatar.hp = jsonData.avatar_config[i].hp * 100;
        tmpAvatar.sp = {
            spCur : jsonData.avatar_config[i].sp * 100,
            spNeed : 10000
        }
        tmpAvatar.level = jsonData.avatar_config[i].level;
        tmpAvatar.rank = jsonData.avatar_config[i].rank;
        tmpAvatar.promotion = jsonData.avatar_config[i].promotion;
        tmpAvatar.avatarType = starrail.AvatarType.AVATAR_FORMAL_TYPE

        // relics
        for (let j = 0; j < jsonData.avatar_config[i].relics.length; j++) {
            const tmpRelic = relicCoder(
                jsonData.avatar_config[i].relics[j].id, 
                jsonData.avatar_config[i].relics[j].level, 
                jsonData.avatar_config[i].relics[j].main_affix_id, 
                jsonData.avatar_config[i].relics[j].stat1, 
                jsonData.avatar_config[i].relics[j].cnt1, 
                jsonData.avatar_config[i].relics[j].stat2, 
                jsonData.avatar_config[i].relics[j].cnt2, 
                jsonData.avatar_config[i].relics[j].stat3, 
                jsonData.avatar_config[i].relics[j].cnt3, 
                jsonData.avatar_config[i].relics[j].stat4, 
                jsonData.avatar_config[i].relics[j].cnt4
            )
            tmpAvatar.relicList.push(tmpRelic)
        }
        const lc = new starrail.BattleEquipment({
            .id = avatarConf.lightcone.id,
            .rank = avatarConf.lightcone.rank,
            .level = avatarConf.lightcone.level,
            .promotion = avatarConf.lightcone.promotion,
        });
        tmpAvatar.equipment_list.append(lc);

    }
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

function relicCoder(
    id: number,
    level: number,
    main_affix_id: number,
    stat1: number, 
    cnt1: number, 
    stat2: number, 
    cnt2: number, 
    stat3: number, 
    cnt3: number, 
    stat4: number, 
    cnt4: number
) : starrail.BattleRelic
{
    const relic : starrail.BattleRelic = new starrail.BattleRelic({
        id: id,
        mainAffixId: main_affix_id,
        level: level,
        subAffixList: []
    })
    relic.subAffixList.push(new starrail.RelicAffix({ affixId : stat1, cnt : cnt1, step : 3 }));
    relic.subAffixList.push(new starrail.RelicAffix({ affixId : stat2, cnt : cnt2, step : 3 }));
    relic.subAffixList.push(new starrail.RelicAffix({ affixId : stat3, cnt : cnt3, step : 3 }));
    relic.subAffixList.push(new starrail.RelicAffix({ affixId : stat4, cnt : cnt4, step : 3 }));
    return relic
}