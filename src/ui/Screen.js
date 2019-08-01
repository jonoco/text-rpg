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
import HelpUI from './HelpUI';


export class Screen extends blessed.screen {
  /**
   * Handles UI management
   */
  constructor(props) 
  {
    super(props);

    this.debug = false;
    this.game = props.game;
    this.currentScreen = null;
    this.lastScreen = null;

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
    this.helpUI = new HelpUI();

    this.subscribeEvents();
  }


  toggleDebug(debug) 
  {
    if (debug) {
      this.append(this.debugUI.log);
      this.debugUI.log.focus();
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

    // Quit on Escape, q, or Control-C.
    this.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    // Debug toggling
    this.key(['d'], (ch, key) => {
      this.debug = !this.debug;
      this.toggleDebug(this.debug);
    });

    this.key(['i'], (ch, key) => {
      if (this.currentScreen === GameState.battle)
        debug('cannot open inventory during battle');
      else
        this.switchScreen(GameState.inventory);
    });

    this.key(['a'], (ch, key) => {
      if (this.currentScreen === GameState.battle)
        debug('cannot open abilities during battle');
      else
        this.switchScreen(GameState.ability);
    });

    this.key(['e'], (ch, key) => {
      if (this.currentScreen === GameState.battle)
        debug('cannot open equipment during battle');
      else
        this.switchScreen(GameState.equipment);
    });

    this.key(['s'], () => {
      if (this.currentScreen === GameState.battle)
        debug('cannot open skills during battle');
      else
        this.switchScreen(GameState.skills);
    });

    this.key(['c'], () => {
      if (this.currentScreen === GameState.battle)
        debug('cannot close battle screen');
      else
        this.switchScreen(GameState.world);
    });

    this.key(['h'], () => {
      this.switchScreen(GameState.help);
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
    on([
      'skills.close', 'inventory.close', 'equipment.close', 'abilities.close'
      ], () => { this.switchScreen(GameState.world) });

    on('battle.over.lose', () => { this.switchScreen(GameState.gameover) });
    on('gameover', () => { this.switchScreen(GameState.gameover) });
    on('cancel', () => { this.switchScreen(this.lastScreen) });
  }


  switchScreen(gs)
  {
    debug(`switch screen to ${gs}`);
  
    this.lastScreen = this.currentScreen;
    this.currentScreen = gs;

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
        emit('equipment.open');
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
      case GameState.help:
        this.append(this.helpUI);
        break;
      default:
        // load an error or menu
        this.append(this.errorUI.widget);
    }

    this.render();
  }
}