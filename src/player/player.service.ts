import { Injectable, NotFoundException } from '@nestjs/common';
import { Player } from './player.model';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PlayerService {
  private players: Player[] = [];

  addPlayer(id: string) {
    const newPlayer = new Player(id, 'token#' + id, false);
    this.players.push(newPlayer);
    return newPlayer;
  }

  getPlayers() {
    return [...this.players];
  }

  getPlayerTokenId(id: string) {
    const [player] = this.findPlayer(id);
    return player.tokenId;
  }

  @OnEvent('player won')
  playerWon({ id }: { id: string }) {
    console.log(id);
    const [player, index] = this.findPlayer(id);
    const winner = { ...player, winner: true };
    this.players[index] = winner;
    console.log('Player ' + id + ' WON!!');
    process.kill(process.pid, 'SIGTERM');
  }

  getTokenIdPlayer(id: string) {
    if (this.players.length == 1) {
      throw new Error('At least two players are required.');
    }
    const [player] = this.findPlayer(id);
    return player.tokenId;
  }

  private findPlayer(id: string): [Player, number] {
    const foundIndex = this.players.findIndex((player) => player.id == id);
    if (foundIndex == -1) {
      throw new NotFoundException('Could not find player.');
    }
    return [this.players[foundIndex], foundIndex];
  }
}
