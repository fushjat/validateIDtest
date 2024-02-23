import { Module } from '@nestjs/common';

import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinnerInterceptor } from 'src/interceptor/winner.interceptor';

@Module({
  controllers: [TokenController],
  providers: [
    TokenService,
    {
      provide: APP_INTERCEPTOR,
      useClass: WinnerInterceptor,
    },
  ],
})
export class TokenModule {}
