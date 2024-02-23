import { Injectable, NotFoundException } from '@nestjs/common';
import { Token } from './token.model';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TokenService {
  private tokens: Token[] = [];
  @OnEvent('player added')
  addToken({ playerId }: { playerId: string }) {
    const token = new Token('token#' + playerId, playerId, 1);
    this.tokens.push(token);
    return token;
  }

  getTokens() {
    return this.tokens;
  }

  @OnEvent('move token')
  movePosition({
    tokenId,
    diceResult,
  }: {
    tokenId: string;
    diceResult: number;
  }) {
    console.log(
      'Moving token with ID ' + tokenId + ' ' + diceResult + ' positions.',
    );
    const [token, index] = this.findToken(tokenId);
    const positionUpdated = this.moveToken(token.position, diceResult);
    const newTokenPosition = { ...token, position: positionUpdated };
    this.tokens[index] = { ...newTokenPosition };
    console.log(
      'Current position of token with ID ' + tokenId + ' is ' + positionUpdated,
    );
    return { position: positionUpdated, tokenOwner: token.ownerId };
  }

  private moveToken(position: number, positionToMove: number) {
    if (position + positionToMove == 100) {
      return 100;
    } else if (position + positionToMove < 100) {
      return position + positionToMove;
    } else return position;
  }

  private findToken(id: string): [Token, number] {
    const foundIndex = this.tokens.findIndex((token) => token.id == id);
    if (foundIndex == -1) {
      throw new NotFoundException('Could not find Token.');
    }
    return [this.tokens[foundIndex], foundIndex];
  }
}
