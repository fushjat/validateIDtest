import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Controller('/player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getAllPlayers() {
    return this.playerService.getPlayers();
  }

  @Patch(':id')
  throwDice(@Param('id') playerId: string) {
    const diceResult = this.randomIntFromInterval(1, 6);
    const tokenId = this.playerService.getTokenIdPlayer(playerId);
    this.eventEmitter.emit('move token', { tokenId, diceResult });
    return null;
  }

  @Post('/:id')
  addPlayer(@Param('id') playerId: string) {
    const player = this.playerService.addPlayer(playerId);
    this.eventEmitter.emit('player added', { playerId });
    return player;
  }

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
