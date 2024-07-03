interface Lightcone {
    id: number;
    rank: number;
    level: number;
    promotion: number;
}

interface Relic {
    id: number;
    level: number;
    main_affix_id: number;
    sub_count: number;
    stat1: number;
    cnt1: number;
    stat2: number;
    cnt2: number;
    stat3: number;
    cnt3: number;
    stat4: number;
    cnt4: number;
}

interface Avatar {
    id: number;
    hp: number;
    sp: number;
    level: number;
    promotion: number;
    rank: number;
    lightcone: Lightcone;
    relics: Relic[];
    use_technique: boolean;
}

interface BattleConfig {
    battle_id: number;
    stage_id: number;
    cycle_count: number;
    monster_wave: number[][];
    monster_level: number;
    blessings: number[];
}

interface GameConfig {
    battle_config: BattleConfig;
    avatar_config: Avatar[];
}
