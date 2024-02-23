import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { TokenModule } from './token/token.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PlayerModule, TokenModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
