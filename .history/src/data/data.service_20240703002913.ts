import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra';
import { GameConfig, readConfig } from "./loadConfig"

export interface VersionConfig {
    [key: string]: {
        asset_bundle_url: string;
        ex_resource_url: string;
        lua_url: string;
        lua_version: string;
    };
}

@Injectable()
export class DataService {
    private dataVersion: VersionConfig;
    private dataInGame: GameConfig;
    constructor() {
        // version input
        const filePathVersion = path.resolve(process.cwd(),'./src/data/version.json');
        const fileContentsVersion = fs.readFileSync(filePathVersion, 'utf-8');
        this.dataVersion = JSON.parse(fileContentsVersion) as VersionConfig;

        //Game input
        const filePathConfig = path.resolve(process.cwd(),'./src/data/config.json');
        this.dataInGame = readConfig("")
    }

    getVersionData(): VersionConfig {
        return this.dataVersion;
    }

    getDataInGame() {

    }

    async updateDataInGame() {

    }
}
