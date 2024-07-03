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
        const avatar: starrail.Avatar = new starrail.Avatar({
            level: avatarConf.level,
            promotion: avatarConf.promotion,
            rank: avatarConf.rank,
            equipmentUniqueId: genId.nextId(),
            equipRelicList: Array.from({ length: 6 }, (_, index) => new starrail.EquipRelic({
                relicUniqueId: genId.nextId(),
                slot: index
            })),
            skilltreeList: []
        });

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