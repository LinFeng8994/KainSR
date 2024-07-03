import { Module } from '@nestjs/common';
import { DataService } from './data.service';
@G
@Module({
  providers: [DataService],
  exports: [DataService]
})
export class DataModule {}
