import { Injectable } from '@nestjs/common';

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

}
