import { HttpModule, Module } from "@nestjs/common";

import { AgoraController } from './agora.controller';
import { AgoraService } from './agora.service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [AgoraController],
  providers: [AgoraService]
})
export class AgoraModule {}
