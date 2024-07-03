import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { AvatarJson, BattleType, JsonData, Monster } from 'src/data/loadData';

export async function onStartCocoonStageCsReq (
    body: starrail.StartCocoonStageCsReq, 
    session: NetSession,
    dataModule: DataService | null = null
) {
    const player : JsonData = dataModule.getDataInGame();
    
    const battle_info: starrail.SceneBattleInfo = new starrail.SceneBattleInfo({
        stageId: player.battle_config.stage_id,
        logicRandomSeed: Math.floor(Math.random() * 100000), 
        battleId: 1,
        // ohfkoaahoib: player.battle_config.cycle_count, 
    });

    // Avatars
    for (let i = 0; i < 4; i++) {
        const avatar_id = player.lineups[i] ?? 0;
        if (avatar_id === 0) continue;
        const avatar = player.avatars[avatar_id];
        if (avatar) {
            const [battle_avatar, techs] = avatar.toBattleAvatarProto(
                i,
                player.lightcones.find(v => v.equip_avatar === avatar.avatarId),
                player.relics.filter(v => v.equip_avatar === avatar.avatarId)
            );
            techs.forEach(tech => battle_info.buffList.push(tech));
            battle_info.battleAvatarList.push(battle_avatar);
        }
    }

    // Custom stats for avatars
    player.battle_config.custom_stats.forEach(stat => {
        battle_info.battleAvatarList.forEach(avatar => {
            if (avatar.relicList.length === 0) {
                avatar.relicList.push({
                    id: 61011,
                    mainAffixId: 1,
                    level: 1,
                });
            }

            const sub_affix = avatar.relicList[0].subAffixList.find(v => v.affixId === stat.sub_affix_id);
            if (sub_affix) {
                sub_affix.cnt = stat.count;
            } else {
                avatar.relicList[0].subAffixList.push({
                    affixId: stat.sub_affix_id,
                    cnt: stat.count,
                    step: stat.step,
                });
            }
        });
    });

    // Blessings
    player.battle_config.blessings.forEach(blessing => {
        const buffs: starrail.BattleBuff = new starrail.BattleBuff({
            id: blessing.id,
            level: blessing.level,
            waveFlag: 0xffffffff,
            ownerIndex: 0xffffffff,
        });
        if (blessing.dynamic_key) {
            buffs.dynamicValues[blessing.dynamic_key.key]= blessing.dynamic_key.value;
        }
        battle_info.buffList.push(buffs);
    });

    // PF score object
    if (player.battle_config.battle_type === BattleType.PF) {
        const battle_target: starrail.BattleTa = new starrail.BattleTa({
            fdfcmhbhnmc: [{
                id: 10001,
                progress: 0,
            }],
        });
        battle_info.jelkfckaonl[1] = battle_target;
        for (let i = 2; i <= 4; i++) {
            battle_info.jelkfckaonl[i]= { fdfcmhbhnmc: [] };
        }
        battle_info.jelkfckaonl[5]= {
            fdfcmhbhnmc: [{
                id: 2001,
                progress: 0,
            }, {
                id: 2002,
                progress: 0,
            }],
        };
    }

    // Apocalyptic Shadow
    if (player.battle_config.battle_type === BattleType.AS) {
        const battle_target: starrail.KNBBHOJNOFF = new starrail.KNBBHOJNOFF({
            fdfcmhbhnmc: [{
                id: 90005,
                progress: 0,
            }],
        });
        battle_info.jelkfckaonl[1] = battle_target;
    }

    // SU
    if (player.battle_config.battle_type === BattleType.SU) {
        battle_info.ldkhpbclcbd.push({
            ejilnblflii: player.battle_config.path_resonance_id,
            status: {
                sp: {
                    curAmount: 10000,
                    maxAmount: 10000,
                },
            },
        });
    }

    // Monsters
    battle_info.monsterWaveList = Monster.toSceneMonsterWaves(player.battle_config.monsters);

    const proto: starrail.StartCocoonStageScRsp = new starrail.StartCocoonStageScRsp({
        retcode: 0,
        propEntityId: body.propEntityId,
        cocoonId: body.cocoonId,
        wave: body.wave,
        battleInfo: battle_info,
    });

    // const bufferData = this.dataService.decodeMessageToBuffer("StartCocoonStageScRsp", proto);
    const bufferData = starrail.StartCocoonStageScRsp.encode(proto).finish()

    await session.send(CmdID.CmdStartCocoonStageScRsp, bufferData);
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