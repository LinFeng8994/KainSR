import { Controller, Get, Post, Query } from '@nestjs/common';
import { HttpServerService } from './http-server.service';

@Controller('')
export class HttpServerController {
    constructor(
        private http: HttpServerService
    ){}
    
    @Get("/query_dispatch")   
    async getDispatch() {
        const data = await this.http.getDispatchService()
        return data
    }
        

    @Get("/query_gateway")
    async getGateway(@Query("version") version : string) {
        return await this.http.getGatewayService(version);
    }

    @Post("/:product_name/mdk/shield/api/login")
    async loginWithPassword() {
        return await this.http.loginWithAnyService();
    }

    @Post("/:product_name/mdk/shield/api/verify")
    async loginWithSessionToken() {
        return await this.http.loginWithAnyService();
    }

    @Post("/:product_name/combo/granter/login/v2/login")
    async granterLoginVerification() {
        return await this.http.granterLoginVerificationService();
    }

    @Post("/account/risky/api/check")
    async riskyApiCheck() {
        return await this.http.riskyApiCheckService();
    }
}
