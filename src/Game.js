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
import { getCharacterDefaultHealth } from './selectors';

import { newCharacter, receiveAbility, receiveSkill, heal, receiveExperience } from './actions/characterActions';
import { receiveItem, equipItem } from './actions/inventoryActions';

export class Game {
  constructor() 
  {
    //
  }  


  /*
    Main game entry point
  */
  start()
  {
    this.battle.start();
    this.gameMap.start();
    this.screen.start();

    Character.createPlayer();

    // Start game
    // show introduction, character creation screen, etc.
    // just start world movement for now
    emit('map');
  }
  

  async load() 
  {
    this.battle = new Battle({ 
      game: this 
    });
    this.gameMap = new GameMap();
    this.screen = new Screen({
      smartCSR: true,
      log: 'mylog.log',
      dump: 'mydump.log',
      game: this
    });

    this.subscribeEvents();

    await this.battle.load();
    await this.gameMap.load();
    await this.screen.load();
  }


  /*
    Subscribe to event hooks
  */
  subscribeEvents()
  {
    on('debug.log', event => {
      this.screen.log(event.text);
    });

    // Check for battle after moving
    on('move.finish', () => { 
      if (this.checkStartFight())
      {
        // switch to Battle state
        this.battleState();
      }
    });

    // Handle postbattle event; go to world screen after postbattle screen
    on('battle.over.win', args => { this.postBattleState(args) });
  }


  /*
    Battle state
    Handle battle data injection
  */
  battleState()
  {
    // Generate an enemy based on player level and location
    Character.createRandomEnemy();

    this.screen.switchScreen(GameState.battle);
    
    emit('battle.initialize');
  }


  /*
    Post-battle check
    Give rewards, experience, etc.
  */
  postBattleState(params)
  {
    const { battle, enemy } = params;
    this.screen.switchScreen(GameState.postBattle);

    const experience = enemy.experience;
    store.dispatch(receiveExperience('player', experience));

    // generate an appropriate reward and emit reward data
    const item = Item.createRandomItem();
    store.dispatch(receiveItem('player', item));

    const defaultHealth = getCharacterDefaultHealth(store.getState(), 'player');
    store.dispatch(heal('player', 1000, defaultHealth));

    emit('battle.poststart', { item, battle, experience });
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