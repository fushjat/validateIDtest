import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createInterface } from 'node:readline';
import { promisify } from 'node:util';
import axios from 'axios';
const host = 'http://localhost:3000';
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const input = promisify(rl.question).bind(rl);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });
  await app.listen(3000);

  const numberPlayers = await input('What is the number of players? ');
  for (let i = 0; i < numberPlayers; i++) {
    const idplayer = await input(`What is the ID of player ${i}? `);
    await axios.post(host + '/player/' + idplayer);
  }
  let players;
  while (true) {
    players = await axios.get(host + '/player');
    for (let i = 0; i < numberPlayers; i++) {
      console.log(`Player ${players.data[i].id} throws dice!`);
      await axios.patch(host + '/player/' + players.data[i].id);
    }
  }
}
bootstrap();
