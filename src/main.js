import inquirer from 'inquirer';
import { Game } from './Game';
import { clearScreen } from './utility';

// Constants

const main = () => {
  clearScreen();

  var game = new Game();
  game.start();
};


main();
