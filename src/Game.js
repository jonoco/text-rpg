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

import { newCharacter, receiveAbility, receiveSkill, heal, receiveExperience } from './actions/characterActions';
import { receiveItem, equipItem } from './actions/inventoryActions';

export class Game {
  constructor() 
  {
    // Current battle object
    this.battle = new Battle({ game: this });

    this.screen = new Screen({
      smartCSR: true,
      log: 'mylog.log',
      dump: 'mydump.log',
      game: this
    });

    this.subscribeEvents();
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
    on('move', () => { 
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
    store.dispatch(heal('player', 1000));

    emit('battle.poststart', { item, battle, experience });
  }


  /*
    Main game entry point
  */
  start()
  {
    // show introduction, character creation screen, etc.
    Character.createPlayer();

    // just start world movement for now
    emit('map');
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