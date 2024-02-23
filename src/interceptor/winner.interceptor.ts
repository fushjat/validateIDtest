import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, tap } from 'rxjs';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class WinnerInterceptor implements NestInterceptor {
  constructor(
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(() => {
        const tokens = this.tokenService.getTokens();
        for (const token of tokens) {
          if (token.position == 100) {
            this.eventEmitter.emit('player won', { id: token.ownerId });
            return;
          }
        }
      }),
    );
  }
}
