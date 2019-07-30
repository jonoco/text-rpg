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
import Bite from  './abilities/Bite';
import Strength from './skills/Strength';
import Endurance from './skills/Endurance';
import Agility from './skills/Agility';

import { newCharacter, receiveAbility, receiveSkill, heal } from './actions/actions';
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
    on('battle.over.win', () => { this.postBattleState() });
  }


  /*
    Battle state
    Handle battle data injection
  */
  battleState()
  {
    this.screen.switchScreen(GameState.battle);

    // Generate an enemy based on player level and location, then provide it to the battle
    // let enemy = Character.createRandomEnemy();
    store.dispatch(newCharacter('enemy', 'Random Foe!', 25));
    store.dispatch(receiveAbility('enemy', new Bash()));
    store.dispatch(receiveAbility('enemy', new Bite()));

    emit('battle.initialize');
  }


  /*
    Post-battle check
    Give rewards, experience, etc.
  */
  postBattleState(battle)
  {
    this.screen.switchScreen(GameState.postBattle);

    // generate an appropriate reward and emit reward data
    const item = Item.createRandomItem();
    store.dispatch(receiveItem('player', item));
    store.dispatch(heal('player', 1000));

    emit('battle.poststart', { item, battle });
  }


  /*
    Main game entry point
  */
  start()
  {
    // show introduction, character creation screen, etc.
    this.createStarterPlayer();

    // just start world movement for now
    emit('map');
  }


  createStarterPlayer()
  {
    store.dispatch(newCharacter('player', 'Inigio', 100));    

    store.dispatch(receiveAbility('player', new Bash()));
    store.dispatch(receiveAbility('player', new Bite()));
    store.dispatch(receiveSkill('player', new Strength()));
    store.dispatch(receiveSkill('player', new Endurance()));
    store.dispatch(receiveSkill('player', new Agility()));

    // starting equipment
    for (let i = 0; i < 4; i++) {
      let item = Item.createRandomItem();
      store.dispatch(receiveItem('player', item));
      store.dispatch(equipItem('player', item));
    }
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