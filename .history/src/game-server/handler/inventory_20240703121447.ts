import { starrail } from 'src/proto/starrail';
import { NetSession } from "../NetSession"
import { CmdID } from 'src/proto/cmdId';
import { DataService } from 'src/data/data.service';
import { GameConfig } from 'src/data/loadConfig';

export async function onGetBagCsReq (
    body: any, 
    player: NetSession,
    dataModule: DataService | null = null
){
    const genId: UidGenerator = new UidGenerator();
    const proto : starrail.GetBagScRsp = new starrail.GetBagScRsp({
        equipmentList: [],
        relicList: []
    });

    const jsonData: GameConfig = dataModule.getDataInGame();
    for (const avatarConf of jsonData.avatar_config) {
        const lightcone = new starrail.Equipment({
            uniqueId: genId.nextId(),
            APAMKMIGAOP: avatarConf.lightcone.id,
            isProtected: true,
            level: avatarConf.lightcone.level,
            promotion: avatarConf.lightcone.promotion,
            OKMNCEFGIMF: avatarConf.id
        })

        proto.equipmentList.push(lightcone)

        for (const relic of avatarConf.relics) {
            
        }
    }
}


export class UidGenerator {
    private currentId: number;

    constructor() {
        this.currentId = 0;
    }

    public nextId(): number {
        this.currentId = (this.currentId + 1) >>> 0; 
        return this.currentId;
    }
}