import { Module } from '@nestjs/common';
import { HttpServerService } from './http-server.service';
import { HttpServerController } from './http-server.controller';

@Module({
  providers: [HttpServerService],
  controllers: [HttpServerController]
})
export class HttpServerModule {}
