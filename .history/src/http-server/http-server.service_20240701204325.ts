import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpServerService {
    async getDispatchService() {
        const proto: starrail.GlobalDispatchData = new starrail.GlobalDispatchData({
            retcode: 0,
            serverList: [
              {
                name: "KainSR",
                title: "KainSR",
                envType: "11",
                dispatchUrl: "http://127.0.0.1:21000/query_gateway",
              },
            ],
          });
          const buffer = starrail.GlobalDispatchData.encode(proto).finish();
          return Buffer.from(buffer).toString("base64");
        //   return this.dataService.decodeMessageToBase64("GlobalDispatchData", proto.toJSON())
    }

    async getGatewayService(versions : string) {
        const dataVersion : VersionConfig = this.dataService.getVersionData()
        if (!dataVersion[versions]) {
            throw new ForbiddenException(
                'This version does not exist',
            );
        }
        const proto : starrail.Gateserver = new starrail.Gateserver({
            retcode : 0,
            ip: "127.0.0.1",
            port: 23301,
            assetBundleUrl: dataVersion[versions].asset_bundle_url,
            exResourceUrl: dataVersion[versions].ex_resource_url,
            luaUrl: dataVersion[versions].lua_url,
            luaVersion: dataVersion[versions].lua_version,
            ifixVersion: "0",
            pdpbjhfgnjk: true,
            bipcmeeljhj: true,
            hecpclndaac: true,
            nlfkefmfige: true,
            oigmgpfnloj: true,
            pnnionnkbnn: true,
            useTcp: true,
        });
        const buffer = starrail.Gateserver.encode(proto).finish();
        return Buffer.from(buffer).toString("base64");
        // return this.dataService.decodeMessageToBase64("Gateserver", proto)
    }

    async loginWithAnyService() {
        return {
            "data": {
                "account": {
                    "area_code": "**",
                    "email": "KainSR",
                    "country": "VI",
                    "is_email_verify": "1",
                    "token": "mostsecuretokenever",
                    "uid": "1334"
                },
                "device_grant_required": false,
                "reactivate_required": false,
                "realperson_required": false,
                "safe_mobile_required": false
            },
            "message": "OK",
            "retcode": 0
        }
    }

    async riskyApiCheckService() {
        return {
            "data": {
                "id": "06611ed14c3131a676b19c0d34c0644b",
                "action": "ACTION_NONE",
                "geetest": null
            },
            "message": "OK",
            "retcode": 0
        }
    }
    
    async granterLoginVerificationService() { 
        return {
            "data": {
                "account_type": 1,
                "combo_id": "1337",
                "combo_token": "9065ad8507d5a1991cb6fddacac5999b780bbd92",
                "data": "{\"guest\":false}",
                "heartbeat": false,
                "open_id": "1334"
            },
            "message": "OK",
            "retcode": 0
        }
    }
}
