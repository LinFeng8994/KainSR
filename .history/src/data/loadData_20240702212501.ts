import * as path from 'path';
import * as fs from 'fs-extra';
import { 
  starrail
} from 'src/proto/starrail';
import  Long  from 'long';

export type AvatarData = {
    rank: number;
    skills: { [key: number]: number };
};

export class AvatarJson {
    public ownerUid: number;
    public avatarId: number;
    public data: AvatarData;
    public level: number;
    public promotion: number;
    public techniques: number[];
    public spValue?: number;
    public spMax?: number;
    public rank: number;
    constructor() {
        this.ownerUid = 1334;
        this.avatarId = 0;
        this.data = { rank: 0, skills: {} };
        this.level = 0;
        this.promotion = 0;
        this.techniques = [];
        this.rank = 0;
    }
    static fromJSON(data: any): { [key: number]: AvatarJson } {
        const avatars: { [key: number]: AvatarJson } = {};

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const avatarData = data[key];
                const avatar = new AvatarJson();
                avatar.ownerUid = avatarData.owner_uid;
                avatar.avatarId = avatarData.avatar_id;
                avatar.level = avatarData.level;
                avatar.promotion = avatarData.promotion;
                avatar.techniques = avatarData.techniques;
                avatar.spValue = avatarData.sp_value;
                avatar.spMax = avatarData.sp_max;
                avatar.rank = avatarData.data.rank;
                avatar.data.skills = avatarData.data.skills;

                avatars[avatar.avatarId] = avatar;
            }
        }

        return avatars;
    }

    toAvatarProto(lightcone: Lightcone | undefined, relics: Relic[]): starrail.Avatar {
        const avatar: starrail.Avatar = new starrail.Avatar({
            baseAvatarId: this.avatarId,
            exp: 0,
            level: this.level,
            promotion: this.promotion,
            rank: this.data.rank,
            skilltreeList: Object.entries(this.data.skills).map(([pointId, level]) => ({
                pointId: parseInt(pointId),
                level,
            } as starrail.AvatarSkillTree)),
            equipmentUniqueId: lightcone ? 2000 + lightcone.internal_uid : 0,
            firstMetTimestamp: new Long(1712924677),
            equipRelicList: relics.map(relic => relic.toEquipmentRelicProto()),
            hasTakenRewardLevelList : []
        });
        return avatar;
    }
    toBattleAvatarProto(
        index: number,
        lightcone: Lightcone | undefined,
        relics: Relic[]
    ): [starrail.BattleAvatar, starrail.BattleBuff[]] {
        const battle_avatar: starrail.BattleAvatar = new starrail.BattleAvatar({
            index,
            avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
            id: this.avatarId,
            level: this.level,
            rank: this.data.rank,
            skilltreeList: Object.entries(this.data.skills).map(([pointId, level]) => ({
                pointId: parseInt(pointId),
                level,
            } as starrail.AvatarSkillTree)),
            equipmentList: lightcone ? [lightcone.toBattleEquipmentProto()] : [],
            hp: 10000,
            promotion: this.promotion,
            relicList: relics.map(v => v.toBattleRelicProto()),
            worldLevel: 6,
            sp: {
                curAmount: this.spValue ?? 10000,
                maxAmount: this.spMax ?? 10000,
            },
        });
    
        const battle_buff: starrail.BattleBuff[] = [];
        for (const buff_id of this.techniques) {
            battle_buff.push(new starrail.BattleBuff({
                waveFlag: 0xffffffff,
                ownerIndex: index,
                level: 1,
                id: buff_id,
            }));
        }
    
        return [battle_avatar, battle_buff];
    }
    toLineupAvatarProto(slot: number): starrail.LineupAvatar {
        return new starrail.LineupAvatar( {
            id: this.avatarId,
            hp: 10000,
            satiety: 100,
            avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
            sp: {
                curAmount: this.spValue ?? 10000,
                maxAmount: this.spMax ?? 10000,
            },
            slot: slot,
        });
    }

    static toLineupAvatars(player: JsonData): starrail.LineupAvatar[] {
        const avatarIds = Object.values(player.avatars).map(v => v.avatarId);

        return Object.entries(player.lineups)
            .filter(([_, v]) => v > 0 && avatarIds.includes(v))
            .map(([slot, avatarId]) => {
                const avatar = player.avatars[avatarId];
                return avatar.toLineupAvatarProto(parseInt(slot));
            })
            .sort((a, b) => a.slot - b.slot);
    }

    static toLineupInfo(lineups: { [slot: number]: number }): starrail.LineupInfo {
        const avatarList: starrail.LineupAvatar[] = [];
        for (const slot in lineups) {
            const avatarId = lineups[slot];
            if (avatarId === 0) continue;

            avatarList.push(new starrail.LineupAvatar({
                id: avatarId,
                hp: 10000,
                satiety: 100,
                avatarType: starrail.AvatarType.AVATAR_FORMAL_TYPE,
                sp: {
                    spCur: 10000,
                    spNeed: 10000,
                },
                slot: parseInt(slot),
            }));
        }

        return new starrail.LineupInfo( {
            extraLineupType: starrail.ExtraLineupType.LINEUP_NONE,
            name: "Squad 1",
            mp: 5,
            mpMax: 5,
            avatarList: avatarList,
        });
    }
}


export class Lightcone {
    public level: number;
    public item_id: number;
    public equip_avatar: number;
    public rank: number;
    public promotion: number;
    public internal_uid: number;

    constructor(data: { level: number; item_id: number; equip_avatar: number; rank: number; promotion: number; internal_uid: number }) {
        this.level = data.level;
        this.item_id = data.item_id;
        this.equip_avatar = data.equip_avatar;
        this.rank = data.rank;
        this.promotion = data.promotion;
        this.internal_uid = data.internal_uid;
    }

    static fromJSON(data: any[]): Lightcone[] {
        return data.map(item => new Lightcone({
            level: item.level,
            item_id: item.item_id,
            equip_avatar: item.equip_avatar,
            rank: item.rank,
            promotion: item.promotion,
            internal_uid: item.internal_uid
        }));
    }

    toEquipmentProto(): starrail.Equipment {
        return new starrail.Equipment({ 
            exp: 0,
            isProtected: false,
            level: this.level,
            promotion: this.promotion,
            rank: this.rank,
            uniqueId: 2000 + this.internal_uid,
        });
    }

    toBattleEquipmentProto(): starrail.BattleEquipment {
        return new starrail.BattleEquipment( {
            id: this.item_id,
            level: this.level,
            promotion: this.promotion,
            rank: this.rank,
        });
    }
}

type SubAffix = {
    sub_affix_id: number;
    count: number;
    step: number;
}

export class Relic {
    public level: number;
    public relic_id: number;
    public relic_set_id: number;
    public main_affix_id: number;
    public sub_affixes: SubAffix[];
    public internal_uid: number;
    public equip_avatar: number;
    constructor() {}

    static fromJSON(data: any[]): Relic[] {
        return data.map(item => {
            const relic = new Relic();
            relic.level = item.level;
            relic.relic_id = item.relic_id;
            relic.relic_set_id = item.relic_set_id;
            relic.main_affix_id = item.main_affix_id;
            relic.internal_uid = item.internal_uid;
            relic.equip_avatar = item.equip_avatar;

            relic.sub_affixes = item.sub_affixes.map((subAffix: any) => ({
                sub_affix_id: subAffix.sub_affix_id,
                count: subAffix.count,
                step: subAffix.step,
            } as SubAffix));

            return relic;
        });
    }
    toRelicProto(): starrail.Relic {
        return new starrail.Relic({
            baseAvatarId: this.equip_avatar,
            cmmegdchmlb: this.equip_avatar, 
            exp: 0,
            isProtected: false,
            level: this.level,
            mainAffixId: this.main_affix_id,
            tid: this.relic_id,
            uniqueId: 1 + this.internal_uid,
            subAffixList: this.sub_affixes.map(v => ({
                affixId: v.sub_affix_id,
                cnt: v.count,
                step: v.step,
            } as starrail.RelicAffix)),
        });
    }

    toBattleRelicProto(): starrail.BattleRelic {
        return new starrail.BattleRelic({
            id: this.relic_id,
            level: this.level,
            mainAffixId: this.main_affix_id,
            uniqueId: this.internal_uid,
            subAffixList: this.sub_affixes.map(v => ({
                affix_id: v.sub_affix_id,
                cnt: v.count,
                step: v.step,
            })),

        });
    }

    toEquipmentRelicProto(): starrail.EquipRelic {
        return new starrail.EquipRelic({
            iaglgkpdloe: this.relic_id % 10,
            ekjochfepap: 1 + this.internal_uid,
        });
    }

}


export class Monster {
    public level: number;
    public monster_id: number;
    public max_hp: number;
    constructor() {}
    toSceneMonsterInfo(): starrail.SceneMonsterData {
        return new starrail.SceneMonsterData({
            monsterId: this.monster_id,
            maxHp: this.max_hp,
            jjhfeikbakk: this.max_hp, // Example field, replace with actual field name if needed
        });
    }

    static toSceneMonsterWave(waveIndex: number, monsters: Monster[]): starrail.SceneMonsterWave {
        let adjustedWaveIndex = waveIndex;
        if (adjustedWaveIndex < 1) {
            adjustedWaveIndex += 1;
        }

        return new starrail.SceneMonsterWave({
            imapolkmefn: adjustedWaveIndex,

            acpannfhach: {
                level: Math.max(...monsters.map((v) => v.level), 95), // Adjust to find max level
            },

            monsterList: monsters.map((v) => v.toSceneMonsterInfo()),

        });
    }

    static toSceneMonsterWaves(monsters: Monster[][]): starrail.SceneMonsterWave[] {
        return monsters
            .map((v, i) => Monster.toSceneMonsterWave(i + 1, v)) 
            .filter((v) => v !== undefined) as starrail.SceneMonsterWave[]; 
    }
}

export class BattleConfig {
    public battle_type: BattleType;
    public monsters: Monster[][];
    public blessings: BattleBuffJson[];
    public stage_id: number;
    public cycle_count: number;
    public path_resonance_id: number;
    public custom_stats: SubAffix[];

    constructor() {
        this.battle_type = BattleType.DEFAULT;
        this.monsters = [[{
            level: 95,
            monster_id: 3014022,
            max_hp: 0,
        } as Monster]];
        this.stage_id = 201012311; 
        this.cycle_count = 20;
        this.path_resonance_id = 0; 
        this.custom_stats = []; 
    }
}


export enum BattleType {
    DEFAULT = 0,
    MOC = 1,
    PF = 2,
    SU = 3,
    AS = 4,
}
export class BattleBuffJson {
    public level: number;
    public id: number;
    public dynamic_key?: DynamicKey | undefined;
    constructor() {}

    toBattleBuffProto(): starrail.BattleBuff {
        const dynamicValues:{[key : string] : number} = {};

        if (this.dynamic_key) {
            dynamicValues[this.dynamic_key.key] = this.dynamic_key.value as number;
        }

        return new starrail.BattleBuff({
            id: this.id,
            level: this.level,
            waveFlag: 0xffffffff,
            ownerIndex: 0xffffffff,
            dynamicValues: dynamicValues,
        });
    }
}

export type DynamicKey = {
    key: string;
    value: number;
}

export class Scene {
    public plane_id: number;
    public floor_id: number;
    public entry_id: number;

    constructor(plane_id: number = 2032101, floor_id: number = 20321, entry_id: number = 20321001) {
        this.plane_id = plane_id;
        this.floor_id = floor_id;
        this.entry_id = entry_id;
    }
}

export class Position {
    public x: number;
    public y: number;
    public z: number;
    public rot_y: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, rotY: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rot_y = rotY;
    }

    isEmpty() : boolean {
        return this.x == 0 && this.y == 0 && this.z == 0
    }

    toMotion(): starrail.MotionInfo {
       return new starrail.MotionInfo({
            rot:  {
                x: 0,
                y: this.rot_y,
                z: 0,
            },
            pos: {
                x: this.x,
                y: this.y,
                z: this.z,
            },
        })
    }
}


export enum Gender {
    Man,
    Woman,
}

export enum MultiPathAvatarType {
    BoyWarrior,
    GirlWarrior,
    BoyKnight,
    GirlKnight,
    BoyShaman,
    GirlShaman,
}

export class MainCharacter {
    static readonly MalePhysical = 8001;
    static readonly FemalePhysical = 8002;
    static readonly MalePreservation = 8003;
    static readonly FemalePreservation = 8004;
    static readonly MaleHarmony = 8005;
    static readonly FemaleHarmony = 8006;

    value: number;

    constructor(value: number | MainCharacter = 8006) {
        if (typeof value === 'number') {
            this.value = MainCharacter.from(value);
        }
        else {
            this.value = value.value;
        }
    }

    static from(value: number | MainCharacter): number {
        switch (value) {
            case MainCharacter.MalePhysical:
                return MainCharacter.MalePhysical;
            case MainCharacter.FemalePhysical:
                return MainCharacter.FemalePhysical;
            case MainCharacter.MalePreservation:
                return MainCharacter.MalePreservation;
            case MainCharacter.FemalePreservation:
                return MainCharacter.FemalePreservation;
            case MainCharacter.MaleHarmony:
                return MainCharacter.MaleHarmony;
            case MainCharacter.FemaleHarmony:
                return MainCharacter.FemaleHarmony;
            default:
                return MainCharacter.FemaleHarmony;
        }
    }

    getGender(): starrail.Gender {
        return this.value % 2 === 1 ? starrail.Gender.GenderMan :  starrail.Gender.GenderWoman;
    }

    getType(): starrail.MultiPathAvatarType {
        switch (this.value) {
            case MainCharacter.MalePhysical:
                return starrail.MultiPathAvatarType.BoyWarriorType;
            case MainCharacter.FemalePhysical:
                return starrail.MultiPathAvatarType.GirlWarriorType;
            case MainCharacter.MalePreservation:
                return starrail.MultiPathAvatarType.BoyKnightType;
            case MainCharacter.FemalePreservation:
                return starrail.MultiPathAvatarType.GirlKnightType;
            case MainCharacter.MaleHarmony:
                return starrail.MultiPathAvatarType.BoyShamanType;
            case MainCharacter.FemaleHarmony:
                return starrail.MultiPathAvatarType.GirlShamanType;
            default:
                return starrail.MultiPathAvatarType.GirlShamanType;
        }
    }

    static default(): MainCharacter {
        return new MainCharacter(MainCharacter.FemaleHarmony);
    }
}

export class JsonData2 {
    public lineups: { [key: number]: number };
    public position: Position;
    public scene: Scene;
    public main_character: MainCharacter;

    constructor() {
        this.lineups = {
            0: 8006,
            1: 0,
            2: 0,
            3: 0,
        };
        this.position = new Position(0, 0, 0, 0);
        this.scene = {
            plane_id: 20321,
            floor_id: 20321001,
            entry_id: 2032101,
        };
        this.main_character = new MainCharacter(8006)
    }

    static fromJson(json: any): JsonData2 {
        const newData = new JsonData2();
        if (json.lineups) newData.lineups = json.lineups;
        if (json.position) newData.position = json.position;
        if (json.scene) newData.scene = json.scene;
        if (json.main_character) newData.main_character = json.main_character;
        return newData;
    }
}

export type JsonData = {
     lightcones: Lightcone[];
     relics: Relic[];
     avatars: { [key: number]: AvatarJson };
     battle_config: BattleConfig;
     lineups: { [key: number]: number };
     position: Position;
     scene: Scene;
     main_character: MainCharacter;
}

export class JsonDataProcess {
    public data: JsonData

    constructor() {}

    async getData() : Promise<JsonData> {
        const filePath = path.resolve(process.cwd(), './src/data/freesr-data.json');
        const jsonDataString = await fs.promises.readFile(filePath, 'utf-8');
        const jsonDataRead: JsonData = JSON.parse(jsonDataString);
        this.data = jsonDataRead;
        this.data.main_character = new MainCharacter(this.data.main_character)
        this.data.lightcones = Lightcone.fromJSON(this.data.lightcones)
        this.data.relics = Relic.fromJSON(this.data.relics)
        this.data.avatars = AvatarJson.fromJSON(this.data.avatars)
        this.data.scene = new Scene(this.data.scene.plane_id, this.data.scene.floor_id, this.data.scene.entry_id)
        this.data.position = new Position(
            this.data.position.x,
            this.data.position.y, 
            this.data.position.z,
            this.data.position.rot_y 
        )
        return this.data;
    }


    async load(): Promise<void> {
        try {
            const filePath = path.resolve(process.cwd(), './src/data/freesr-data.json');
            const jsonDataString = await fs.promises.readFile(filePath, 'utf-8');
            const jsonDataRead: JsonData = JSON.parse(jsonDataString);
            this.data = jsonDataRead
            const json2Path = path.resolve(process.cwd(), './src/data/persistent');
            const json2String = await fs.promises.readFile(json2Path, 'utf-8');
            const json2: JsonData2 = JSON.parse(json2String);

            this.data.lineups = json2.lineups;
            this.data.position = json2.position;
            this.data.scene = json2.scene;
            this.data.main_character = json2.main_character;

            await this.verifyLineup(this.data);
        } catch (error) {
            console.error('Failed to load data:', error);
            throw error;
        }
    }

    private async verifyLineup(data : JsonData): Promise<void> {
        if (Object.keys(data.lineups).length === 0) {
            data.lineups = {
                0: 8006,
                1: 0,
                2: 0,
                3: 0,
            };
        } else if (Object.keys(data.lineups).length < 4) {
            for (let i = Object.keys(data.lineups).length; i < 4; i++) {
                data.lineups[i] = 0;
            }
        }
        await this.save(data);
    }

    async save(data : JsonData): Promise<void> {
        try {
            const jsonPath = path.resolve(process.cwd(), './src/data/freesr-data.json');
            const json2Path = path.resolve(process.cwd(), './src/data/persistent');

            await Promise.all([
                fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8'),
                fs.promises.writeFile(
                    json2Path,
                    JSON.stringify(
                        {
                            lineups: data.lineups,
                            main_character: data.main_character,
                            position: data.position,
                            scene: data.scene,
                        },
                        null,
                        2
                    ),
                    'utf-8'
                ),
            ]);
        } catch (error) {
            console.error('Failed to save data:', error);
            throw error;
        }
    }

    async saveLineup(data: JsonData): Promise<void> {
        await this.save(data);
    }
}

