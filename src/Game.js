import inquirer from 'inquirer';
import blessed from 'blessed';

import { Character } from './Character';
import { GameMap } from './GameMap';
import { Item } from './Item';
import { Battle, BattleCondition } from './Battle'
import { message, clearScreen, debug } from './utility';
import { CANCEL, CONFIRM, _DEBUG_ } from './constants';
import { on, emit } from './dispatch';
import { Screen } from './ui/Screen';
import GameState from './GameState';

export class Game {
  constructor() 
  {
    // this.map = new GameMap();
    this.player = new Character(`Player`, 100, true);

    // Game parameters
    this.battleFrequency = 0.2; // probability to start a fight
    
    this.gameState;

    // Current battle object
    this.battle = new Battle({ game: this });

    this.screen = new Screen({
      smartCSR: true,
      log: 'mylog.log',
      dump: 'mydump.log',
      game: this
    });

    // handle 'Cancel' input
    // this.screen.key('c', () => {
    //   if (this.gameState == GameState.inventory || this.gameState == GameState.equipment)
    //     this.moveState();
    // });

    this.subscribeEvents();
  }  


  /*
    Subscribe to event hooks
  */
  subscribeEvents()
  {
    // Check for battle after moving
    on('move', () => { 
      if (this.checkStartFight())
      {
        // switch to Battle state
        this.battleState();
      }
    });

    // Exit BatleUI
    on('exit', () => {
      this.moveState();
    });

    // Handle the end of a battle
    on('battle.end', event => {
      const condition = event.condition;
      const battle = event.battle;

      switch (condition)
      {
        case BattleCondition.Escape:
          this.moveState();
          break;
        case BattleCondition.Lose:
          this.gameOverState();
          break;
        case BattleCondition.Victory:
          this.postBattleState(battle);
          break;
      }
    });

    // Handle postbattle event; go to world screen after postbattle screen
    on('battle.postend', () => { this.moveState() });

    on('inventory.open', () => { this.inventoryState() });
    on('inventory.close', () => { this.moveState() });

    on('equipment.open', () => { this.equipmentState() });
    on('equipment.close', () => { this.moveState() });

    on('abilities.open', () => { this.abilitiesState() });
    on('abilities.close', () => { this.moveState() });

    on('skills.close', () => { this.moveState() });

    on('battle.over.win', () => { this.postBattleState() });
    on('battle.over.lose', () => { this.gameOverState() });
  }


  /*
    Move state
    Allow player to move, possibly encountering battles
  */
  moveState()
  {
    this.gameState = GameState.world;
    this.screen.switchScreen(GameState.world);
  }


  skillsState()
  {
    this.gameState = GameState.skills;
    this.screen.switchScreen(GameState.skills);
    emit('skills.open', this.player);
  }


  /*
    Battle state
    Handle battle data injection
  */
  battleState()
  {
    this.gameState = GameState.battle;
    this.screen.switchScreen(GameState.battle);

    // Generate an enemy based on player level and location, then provide it to the battle
    let enemy = Character.createRandomEnemy();

    emit('battle.initialize', { player: this.player, enemy });
  }


  /*
    Post-battle check
    Give rewards, experience, etc.
  */
  postBattleState(battle)
  {
    this.gameState = GameState.postBattle;
    this.screen.switchScreen(GameState.postBattle);

    // generate an appropriate reward and emit reward data
    const item = Item.createRandomItem();
    this.player.receiveItem(item);
    this.player.experience += battle.enemy.getExperienceValue();

    emit('battle.poststart', { item, battle });
  }


  /*
    Game over handling
  */
  gameOverState()
  {
    this.gameState = GameState.gameover;
    this.screen.switchScreen(GameState.gameover);
  }


  /*
    Inventory state
  */
  inventoryState()
  {
    this.gameState = GameState.inventory;
    this.screen.switchScreen(GameState.inventory);
    this.screen.setInventoryCharacter(this.player);
  }


  /*
    Equipment state
  */
  equipmentState()
  {
    this.gameState = GameState.equipment;
    this.screen.switchScreen(GameState.equipment);
    this.screen.setEquipmentCharacter(this.player);
  }


  /*
    Abilities state
  */
  abilitiesState()
  {
    this.gameState = GameState.ability;
    this.screen.switchScreen(GameState.ability);
    this.screen.setAbilityCharacter(this.player);
  }


  /*
    Main game entry point
  */
  async start()
  {
    // show introduction, character creation screen, etc.

    // starting equipment
    for (let i = 0; i < 4; i++)
      this.player.receiveItem(Item.createRandomItem());

    // just start world movement for now
    this.moveState();

    // const intro = `You wake up in a graveyard.`;
    // message(intro);

    // while(!this.gameOver)
    // {
    //   clearScreen();
    //   message(`You're at (${this.map.getLocation().x}, ${this.map.getLocation().y})`);
    //   message(`${this.map.getEnvironment().description}`);

    //   let choice;
    //   await inquirer
    //   .prompt([{ 
    //     type: 'list',
    //     name: 'choice',
    //     message: 'What do you want to do?',
    //     choices: [
    //       {name: 'Move'},
    //       {name: 'Rest'},
    //       {name: 'Check inventory', value: 'inventory'},
    //       {name: 'Change equipment', value: 'equipment'},
    //       {name: 'Check status', value: 'status'},
    //       {name: 'Upgrade stats', value: 'upgradeStats'},
    //     ] 
    //   }])
    //   .then(answers => {
    //     choice = answers.choice;
    //   });

    //   switch (choice)
    //   {
    //     case 'Move':
    //       await this.move();
    //       break;
    //     case 'Rest':
    //       await this.rest();
    //       break;
    //     case 'inventory':
    //       await this.player.checkInventory();
    //       break;
    //     case 'equipment':
    //       await this.player.changeEquipment();
    //       break;
    //     case 'status':
    //       await this.player.checkStatus();
    //       break;
    //     case 'upgradeStats':
    //       await this.player.chooseStats();
    //       break;
    //   }
    // }
  }


  /*
    Let player regenerate health, risking battle
  */
  rest() 
  {
    debug (`Healing for ${this.player.defaultHealth}`);

    this.player.heal(this.player.defaultHealth);
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