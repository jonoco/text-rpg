import inquirer from 'inquirer';
import { Character } from './Character';
import { GameMap } from './GameMap';
import { Item } from './Item';
import { Battle } from './Battle'
import { message, clearScreen, debug } from './utility';
import { CANCEL, CONFIRM } from './constants';

export class Game {
  constructor() 
  {
    this.map = new GameMap();
    this.player = new Character(`Player`, 100);

    this.battleFrequency = 0.2; // probability to start a fight
    this.gameOver = false;
  }  

  
  /*
    Allow player to move, possibly encountering battles
  */
  async move()
  {
    while (true)
    {
      let cancel = await this.map.askDirection();
    
      if (cancel) break;

      if (this.checkStartFight())
      {
        await this.battle();
        break;
      }
    }
  }


  /*
    Handle battle
  */
  async battle()
  {
    const battle = new Battle(this.player);
    await battle.start();

    clearScreen();

    if (battle.victory)
    {
      message(`You beat the ${battle.enemy.name}!`);
      this.player.receiveItem(Item.createRandomItem());
    }
    else
    {
      message(`You lost, fool!`);
      this.gameOver = true;
    }

    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'Finished?',
        choices: [
          {name: CONFIRM},
        ] 
      }])
      .then(answers => {
        //...
      });
  }


  /*
    Main game loop and entry point
  */
  async start()
  {
    const intro = `You wake up in a graveyard.`;
    message(intro);

    while(!this.gameOver)
    {
      clearScreen();
      message(`You're at (${this.map.getLocation().x}, ${this.map.getLocation().y})`);
      message(`${this.map.getEnvironment().description}`);

      let choice;
      await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'What do you want to do?',
        choices: [
          {name: 'Move'},
          {name: 'Rest'},
          {name: 'Check inventory', value: 'inventory'},
          {name: 'Change equipment', value: 'equipment'},
          {name: 'Check status', value: 'status'},
        ] 
      }])
      .then(answers => {
        choice = answers.choice;
      });

      switch (choice)
      {
        case 'Move':
          await this.move();
          break;
        case 'Rest':
          await this.rest();
          break;
        case 'inventory':
          await this.player.checkInventory();
          break;
        case 'equipment':
          await this.player.changeEquipment();
          break;
        case 'status':
          await this.player.checkStatus();
          break;
      }
    }
  }


  /*
    Let player regenerate health, risking battle
  */
  async rest() 
  {
    debug (`Healing for ${this.player.defaultHealth}`);

    this.player.heal(this.player.defaultHealth);

    message(`Health recovered. (${this.player.health})`);

    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'Finished?',
        choices: [
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        //...
      });
  }


  /*
    Determine whether a battle should occur
  */
  checkStartFight()
  {
    const shouldStartFight = Math.random() < this.battleFrequency;

    debug(`Start a fight? ${shouldStartFight}`);

    return shouldStartFight;
  }
}