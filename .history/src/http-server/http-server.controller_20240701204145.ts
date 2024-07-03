import { Controller } from '@nestjs/common';

@Controller('http-server')
export class HttpServerController {
    @Get("/query_dispatch")   
    async getDispatch() {
        const data = await this.sdkServerService.getDispatchService()
        return data
    }
        

    @Get("/query_gateway")
    async getGateway(@Query("version") version : string) {
        return await this.sdkServerService.getGatewayService(version);
    }

    @Post("/:product_name/mdk/shield/api/login")
    async loginWithPassword() {
        return await this.sdkServerService.loginWithAnyService();
    }

    @Post("/:product_name/mdk/shield/api/verify")
    async loginWithSessionToken() {
        return await this.sdkServerService.loginWithAnyService();
    }

    @Post("/:product_name/combo/granter/login/v2/login")
    async granterLoginVerification() {
        return await this.sdkServerService.granterLoginVerificationService();
    }

    @Post("/account/risky/api/check")
    async riskyApiCheck() {
        return await this.sdkServerService.riskyApiCheckService();
    }
}
