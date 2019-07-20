import inquirer from 'inquirer';
import blessed from 'blessed';
import { Character } from './Character';
import { GameMap } from './GameMap';
import { Item } from './Item';
import { Battle, BattleCondition } from './Battle'
import { message, clearScreen, debug } from './utility';
import { CANCEL, CONFIRM, _DEBUG_ } from './constants';
import dispatch from './dispatch';

import WorldMapUI from './ui/WorldMapUI';
import ErrorUI from './ui/ErrorUI';
import BattleUI from './ui/BattleUI';
import GameOverUI from './ui/GameOverUI';
import PostBattleUI from './ui/PostBattleUI';
import InventoryUI from './ui/InventoryUI';
import EquipmentUI from './ui/EquipmentUI';
import AbilityUI from './ui/AbilityUI';
import DebugUI from './ui/DebugUI';


const GameState = { 
    world: 0      // world movement
  , battle: 1     // battle screen
  , postBattle: 2 // after battle -> rewards
  , inventory: 3  // inventory
  , equipment: 4  // equipment
  , stats: 5      // player stats and level up
  , gameover: 6   // game over
  , error: 7      // display error
  , ability: 8    // abilities screen
};


export class Game {
  constructor() 
  {
    // this.map = new GameMap();
    this.player = new Character(`Player`, 100);

    // Game parameters
    this.battleFrequency = 0.2; // probability to start a fight
    
    this.gameState;

    // Current battle object
    this.battle = new Battle();

    this.screen = blessed.screen({
      smartCSR: true,
      log: 'mylog.log',
      dump: 'mydump.log'
    });

    /** 
     * Setup any global input hooks
     */
    // Quit on Escape, q, or Control-C.
    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    this.screen.key(['`'], (ch, key) => {
      this.moveState();
    });

    // Create UI screens 
    this.errorUI = new ErrorUI();
    this.mapUI = new WorldMapUI();
    this.battleUI = new BattleUI();
    this.gameoverUI = new GameOverUI();
    this.postBattleUI = new PostBattleUI();
    this.inventoryUI = new InventoryUI();
    this.equipmentUI = new EquipmentUI();
    this.abilityUI = new AbilityUI();
    this.debugUI = new DebugUI();

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
    dispatch.on('move', () => { 
      this.mapUI.log.log('moved around');

      if (this.checkStartFight())
      {
        // switch to Battle state
        this.mapUI.log.log('starting fight');
        this.battleState();
      }
    });

    // Exit BatleUI
    dispatch.on('exit', () => {
      this.moveState();
    });

    // Handle the end of a battle
    dispatch.on('battle.end', event => {
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
    dispatch.on('battle.postend', () => { this.moveState() });

    dispatch.on('inventory.open', () => { this.inventoryState() });
    dispatch.on('inventory.close', () => { this.moveState() });

    dispatch.on('equipment.open', () => { this.equipmentState() });
    dispatch.on('equipment.close', () => { this.moveState() });

    dispatch.on('abilities.open', () => { this.abilitiesState() });
    dispatch.on('abilities.close', () => { this.moveState() });

    dispatch.on('error', event => {
      this.errorUI.widget.setContent(`error:\n${event.text}`);
      this.switchScreen(GameState.error);
    });
  }

  
  /*
    Switch screen based on gameState
    gs - GameState object
  */
  switchScreen(gs)
  {
    this.gameState = gs;

    // dump ui widgets
    this.screen.children.forEach(child => { this.screen.remove(child) });

    switch (gs)
    {
      case GameState.world:
        this.screen.append(this.mapUI.widget);
        this.mapUI.map.focus();
        break;
      case GameState.battle:
        this.screen.append(this.battleUI.widget);
        this.battleUI.list.focus();
        this.battleUI.list.up(10);
        break;
      case GameState.postBattle:
        this.screen.append(this.postBattleUI.widget);
        break;
      case GameState.inventory:
        this.screen.append(this.inventoryUI.widget);
        this.inventoryUI.inventory.focus();
        break;
      case GameState.stats:
        this.screen.append(this.errorUI.widget);
        break;
      case GameState.gameover:
        this.screen.append(this.gameoverUI.widget);
        break;
      case GameState.error:
        this.screen.append(this.errorUI.widget);
        break;
      case GameState.equipment:
        this.screen.append(this.equipmentUI.widget);
        this.equipmentUI.equipment.focus();
        break;
      case GameState.ability:
        this.screen.append(this.abilityUI.widget);
        this.abilityUI.abilityTable.focus();
        break;
      default:
        // load an error screen or menu
        this.screen.append(this.errorUI.widget);
    }

    if (_DEBUG_) this.screen.append(this.debugUI.log);

    this.screen.render();
  }


  /*
    Move state
    Allow player to move, possibly encountering battles
  */
  moveState()
  {
    this.switchScreen(GameState.world);
  }


  /*
    Battle state
    Handle battle data injection
  */
  battleState()
  {
    this.switchScreen(GameState.battle);

    // Generate an enemy based on player level and location, then provide it to the battle
    let enemy = Character.createRandomEnemy();

    this.battle.initialize(this.player, enemy);
  }


  /*
    Post-battle check
    Give rewards, experience, etc.
  */
  postBattleState(battle)
  {
    this.switchScreen(GameState.postBattle);

    this.postBattleUI.widget.focus();
    this.mapUI.log.log('won the battle, yippee!');

    // generate an appropriate reward and emit reward data
    const item = Item.createRandomItem();
    this.player.receiveItem(item);
    this.player.experience += battle.enemy.getExperienceValue();

    dispatch.emit('battle.poststart', { item, battle });
  }


  /*
    Game over handling
  */
  gameOverState()
  {
    this.switchScreen(GameState.gameover);
  }


  /*
    Inventory state
  */
  inventoryState()
  {
    this.switchScreen(GameState.inventory);
    this.inventoryUI.setCharacter(this.player);
  }


  /*
    Equipment state
  */
  equipmentState()
  {
    this.switchScreen(GameState.equipment);
    this.equipmentUI.setCharacter(this.player);
  }


  /*
    Abilities state
  */
  abilitiesState()
  {
    this.switchScreen(GameState.ability);
    this.abilityUI.setCharacter(this.player);
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