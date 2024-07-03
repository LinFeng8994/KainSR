import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { GameConfig } from 'src/data/loadConfig';

export async function onGetCurLineupDataCsReq (
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
){
    const jsonData : GameConfig = dataModule.getDataInGame()
    const lineup : starrail.LineupInfo = new starrail.LineupInfo()
    lineup.HPMGGECENEM = 5;
    lineup.HGBHBGMMOKG = 5;
    lineup.name = "Super LineUp";
    for (let i = 0; i < jsonData.avatar_config.length; i++) {
        const tmpAvatar : starrail.LineupAvatar = new starrail.LineupAvatar();
        switch (jsonData.avatar_config[i].id) {
            case 8001:
            case 8002:
            case 8003:
            case 8004:
            case 8005:
            case 8006:
                tmpAvatar.id = jsonData.avatar_config[i].id;
            default:
                tmpAvatar.id = jsonData.avatar_config[i].id;
        }
        tmpAvatar.slot = i;
        tmpAvatar.satiety = 0;
        tmpAvatar.hp = jsonData.avatar_config[i].hp * 100;
        tmpAvatar.sp = {
            spCur: jsonData.avatar_config[i].sp * 100,
            spNeed: 10000
        }
        tmpAvatar.avatarType = starrail.AvatarType.AVATAR_FORMAL_TYPE;
        lineup.avatarList.push(tmpAvatar)
    }
    const proto : starrail.GetCurLineupDataScRsp = new starrail.GetCurLineupDataScRsp({
        retcode: 0,
        lineup: lineup
    })

    const bufferData = starrail.GetCurLineupDataScRsp.encode(proto).finish()
    await player.send(CmdID.CmdGetCurLineupDataScRsp, bufferData)
}

export async function onChangeLineupLeaderCsReq(
    body: starrail.ChangeLineupLeaderScRsp, 
    player: NetSession,
    dataModule: DataService | null = null
) {

    const proto: starrail.ChangeLineupLeaderScRsp = new starrail.ChangeLineupLeaderScRsp({
        retcode: 0,
        slot: body.slot
    });
    const bufferData = starrail.ChangeLineupLeaderScRsp.encode(proto).finish()

    await player.send(CmdID.CmdChangeLineupLeaderScRsp, bufferData);
}

export async function onReplaceLineupCsReq(
    body: starrail.IPAGJPHJDBD, 
    player: NetSession,
    dataModule: DataService | null = null
) {
    const lineup : starrail.LineupInfo = new starrail.LineupInfo()
    lineup.HPMGGECENEM = 5;
    lineup.HGBHBGMMOKG = 5;
    lineup.name = "Squad 1";

    for (let i = 0; i < r.avatar_config.length; i++) {
        const tmpAvatar : starrail.LineupAvatar = new starrail.LineupAvatar();
        switch (r.avatar_config[i].id) {
            case 8001:
            case 8002:
            case 8003:
            case 8004:
            case 8005:
            case 8006:
                tmpAvatar.id = r.avatar_config[i].id;
            default:
                tmpAvatar.id = r.avatar_config[i].id;
        }
        tmpAvatar.slot = i;
        tmpAvatar.satiety = 0;
        tmpAvatar.hp = r.avatar_config[i].hp * 100;
        tmpAvatar.sp = {
            spCur: jsonData.avatar_config[i].sp * 100,
            spNeed: 10000
        }
        tmpAvatar.avatarType = starrail.AvatarType.AVATAR_FORMAL_TYPE;
        lineup.avatarList.push(tmpAvatar)
    }
}