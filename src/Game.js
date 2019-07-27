import inquirer from 'inquirer';
import blessed from 'blessed';

import { Character } from './Character';
import { GameMap } from './GameMap';
import { Item } from './Item';
import { Battle } from './Battle'
import { message, clearScreen, debug } from './utility';
import { CANCEL, CONFIRM, _DEBUG_ } from './constants';
import { on, emit } from './dispatch';
import { Screen } from './ui/Screen';
import GameState from './GameState';
import { store } from './main';

import Bash from  './abilities/Bash';
import Strength from './skills/Strength';
import Endurance from './skills/Endurance';
import Agility from './skills/Agility';

import { newCharacter, receiveAbility, receiveSkill } from './actions/actions';
import { receiveItem } from './actions/inventoryActions';

export class Game {
  constructor() 
  {
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
    // let enemy = Character.createRandomEnemy();
    store.dispatch(newCharacter('enemy', 'Random Foe!', 25));
    const bash = new Bash();
    store.dispatch(receiveAbility('enemy', bash));

    emit('battle.initialize');
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
    store.dispatch(receiveItem('player', item));

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
  }


  /*
    Equipment state
  */
  equipmentState()
  {
    this.gameState = GameState.equipment;
    this.screen.switchScreen(GameState.equipment);
  }


  /*
    Abilities state
  */
  abilitiesState()
  {
    this.gameState = GameState.ability;
    this.screen.switchScreen(GameState.ability);
  }


  /*
    Main game entry point
  */
  async start()
  {
    // show introduction, character creation screen, etc.

    store.dispatch(newCharacter('player', 'Inigio', 100));
    const bash = new Bash();
    store.dispatch(receiveAbility('player', bash));
    // starting equipment
    for (let i = 0; i < 4; i++)
      store.dispatch(receiveItem('player', Item.createRandomItem()));
    store.dispatch(receiveSkill('player', new Strength()));
    store.dispatch(receiveSkill('player', new Endurance()));
    store.dispatch(receiveSkill('player', new Agility()));

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
    UNUSED
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
    const shouldStartFight = Math.random() < store.getState().game.battleFrequency;

    debug(`Start a fight? ${shouldStartFight}`);

    return shouldStartFight;
  }
}