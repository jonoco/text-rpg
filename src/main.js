import inquirer from 'inquirer';
import { Game } from './Game';

const main = () => {
  const game = new Game();
  game.start();
};


main();
