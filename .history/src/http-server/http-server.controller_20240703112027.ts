import { Controller, Get, Post, Query } from '@nestjs/common';
import { HttpServerService } from './http-server.service';

@Controller('')
export class HttpServerController {
    constructor(
        private httpServerService: HttpServerService
    ){}
    
    @Get("/query_dispatch")   
    async getDispatch() {
        const data = await this.httpServerService.getDispatchService()
        return data
    }
        

    @Get("/query_gateway")
    async getGateway(@Query("version") version : string) {
        return await this.httpServerService.getGatewayService(version);
    }

    @Post("/:product_name/mdk/shield/api/login")
    async loginWithPassword() {
        return await this.httpServerService.loginWithAnyService();
    }

    @Post("/:product_name/mdk/shield/api/verify")
    async loginWithSessionToken() {
        return await this.httpServerService.loginWithAnyService();
    }

    @Post("/:product_name/combo/granter/login/v2/login")
    async granterLoginVerification() {
        return await this.httpServerService.granterLoginVerificationService();
    }

    @Post("/account/risky/api/check")
    async riskyApiCheck() {
        return await this.httpServerService.riskyApiCheckService();
    }


    @Post("/account/risky/api/check")
    async shieldApiCheck() {
        return await this.httpServerService.riskyApiCheckService();
    }
}
