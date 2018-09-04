import inquirer from 'inquirer';
import { Character } from './Character';
import { message, clearScreen } from './utility';

export class Battle {
  constructor(player)
  {
    this.battleOver = false;
    this.victory = false;

    this.enemy = Character.createRandomEnemy();
    this.player = player;
  }


  async start()
  {
    clearScreen();
    message(`---------=---------\nBattle!\n---------=---------`);

    while (!this.battleOver)
    {      
      message(`Fighting a ${this.enemy.name}.`);
      message(`${this.enemy.name} health: ${this.enemy.health}`);
      message(`${this.player.name} health: ${this.player.health}`);

      await this.askAttackChoice();  
    }
  }


  attackEnemy(choice)
  {
    // choice is unused

    message(`Attacking ${this.enemy.name}.`);

    this.enemy.hit(this.player.attackPower());

    if (!this.enemy.isAlive())
    {
      message(`${this.enemy.name} was killed.`);
      this.battleOver = true;
      this.victory = true;
    }
    else
    {
      this.attackPlayer();
    }
  }

  
  attackPlayer()
  {
    message(`${this.enemy.name} is attacking.`);

    this.player.hit(this.enemy.attackPower());

    if (!this.player.isAlive())
    {
      message(`You were killed by a ${this.enemy.name}`);
      this.battleOver = true;
    }
  }


  async askAttackChoice()
  {
    await inquirer
      .prompt([
        { name: "attack", message: "Choose your attack? (1,2)\n" }
      ])
      .then(answers => {
        if (['1','2'].includes(answers.attack)) 
        {
          clearScreen();
          return this.attackEnemy(answers["attack"]);
        } 
        else 
        {
          return this.askAttackChoice();
        }
      });
  }
}