import { Module } from '@nestjs/common';
import { GameServerService } from './game-server.service';

@Module({

  providers: [GameServerService,
    
  ]
})
export class GameServerModule {}
