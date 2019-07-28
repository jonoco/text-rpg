import blessed from 'blessed';

import { emit, on } from '../dispatch';
import { debug } from '../utility';
import GameState from '../GameState';

import WorldMapUI from './WorldMapUI';
import ErrorUI from './ErrorUI';
import BattleUI from './BattleUI';
import GameOverUI from './GameOverUI';
import PostBattleUI from './PostBattleUI';
import InventoryUI from './InventoryUI';
import EquipmentUI from './EquipmentUI';
import AbilityUI from './AbilityUI';
import SkillUI from './SkillUI';
import StateUI from './StateUI';
import DebugUI from './DebugUI';

export class Screen extends blessed.screen {
  constructor(props) 
  {
    super(props);

    this.debug = false;

    this.game = props.game;

    /** 
     * Setup any global input hooks
     */
    // Quit on Escape, q, or Control-C.
    this.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // Debug toggling
    this.key(['d'], (ch, key) => {
      this.debug = !this.debug;
      this.toggleDebug(this.debug);
    });

    this.key(['s'], () => {
      debug('open skills');
      if (this.battleUI.attached) {
        debug('cannot open skills');
      }
      emit('skills');
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
    this.skillUI = new SkillUI();
    this.debugUI = new DebugUI();
    this.stateUI = new StateUI();

    this.subscribeEvents();
  }


  toggleDebug(debug) 
  {
    if (debug) {
      this.append(this.debugUI.log);
    } else {
      this.debugUI.log.detach();
    }

     this.render();
  }


  subscribeEvents()
  {
    this.key(['/'], (ch, key) => {
      this.switchScreen(GameState.state);
    });

    // Force out to world map
    this.key(['`'], (ch, key) => {
      this.switchScreen(GameState.world);
    });

    // Check for battle after moving
    on('move', () => { 
      this.mapUI.log.log('moved around');
    });

    on('battle.start', () => {
      this.mapUI.log.log('starting fight');
    });

    on('error', event => {
      this.errorUI.widget.setContent(`error:\n${event.text}`);
      this.switchScreen(GameState.error);
    });

    on('map', () => { this.switchScreen(GameState.world) });

    on('skills', () => { this.switchScreen(GameState.skills) });
    on('skills.close', () => { this.switchScreen(GameState.world) });

    on('inventory.open', () => { this.switchScreen(GameState.inventory)});
    on('inventory.close', () => { this.switchScreen(GameState.world) });
    
    on('equipment.open', () => { this.switchScreen(GameState.equipment) });
    on('equipment.close', () => { this.switchScreen(GameState.world) });

    on('abilities.open', () => { this.switchScreen(GameState.ability) });
    on('abilities.close', () => { this.switchScreen(GameState.world) });

    on('battle.over.lose', () => { this.switchScreen(GameState.gameover) });
    on('gameover', () => { this.switchScreen(GameState.gameover) });
  }


  switchScreen(gs)
  {
    debug(`switch screen to ${gs}`);
    // dump ui widgets
    this.children.forEach(child => { this.remove(child) });

    switch (gs)
    {
      case GameState.world:
        this.append(this.mapUI.widget);
        this.mapUI.map.focus();
        break;
      case GameState.battle:
        this.append(this.battleUI.widget);
        this.battleUI.list.focus();
        this.battleUI.list.up(10);
        break;
      case GameState.postBattle:
        this.append(this.postBattleUI.widget);
        this.postBattleUI.widget.focus();
        this.mapUI.log.log('won the battle, yippee!');
        break;
      case GameState.inventory:
        this.append(this.inventoryUI);
        this.inventoryUI.inventory.focus();
        emit('inventory.update');
        this.render();
        break;
      case GameState.stats:
        this.append(this.errorUI.widget);
        break;
      case GameState.gameover:
        this.append(this.gameoverUI.widget);
        break;
      case GameState.error:
        this.append(this.errorUI.widget);
        break;
      case GameState.equipment:
        this.append(this.equipmentUI);
        this.equipmentUI.equipment.focus();
        break;
      case GameState.ability:
        this.append(this.abilityUI);
        this.abilityUI.abilityTable.focus();
        emit('abilities.update');
        break;
      case GameState.skills:
        this.append(this.skillUI);
        emit('skills.open');
        break;
      case GameState.state:
        this.append(this.stateUI);
        emit('state.open');
        break;
      default:
        // load an error or menu
        this.append(this.errorUI.widget);
    }

    this.render();
  }
}