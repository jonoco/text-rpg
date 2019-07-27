import { Character } from './Character';
import { on, emit } from './dispatch';
import { getRandomChoice, getRandomInt, debug } from './utility';
import { store } from './main';
import { hurt, heal, nextTurn } from './actions/actions';

/*
  Handles battle logic
*/
export class Battle {
  constructor(props)
  {
    this.game = props.game;
    
    on('battle.initialize', this.initialize.bind(this));
    on('battle.player.finish', this.playerCombatant.bind(this));
  }

  
  /*
    Initialize a new battle
  */
  initialize()
  {
    // start the battle
    emit('battle.start');
    this.combatantTurnStart();
  }


  combatantTurnStart()
  {
    const isPlayerTurn = store.getState().battle.isPlayerTurn;
    if (isPlayerTurn) {
      // allow ui control
      emit('battle.player.start');
    } else {
      // use ai control
      this.autoCombatant();
    }
  }

  /**
   * Playable combat routine
   */
  playerCombatant(params)
  {
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;

    const abilityName = params.ability;
    const ability = player.abilities.find(a => abilityName == a.name);
    
    emit('battle.update', { 
      text: `${player.name} targets ${enemy.name} with ${ability.name}`
    });
    debug(`${player.name} targets ${enemy.name} with ${ability.name}`);

    const result = ability.use(player, enemy);
    store.dispatch(hurt('enemy', result.damage));

    this.checkBattleState();
  }

  /**
   * AI combat routine
   */
  autoCombatant()
  {
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;

    if (!player) {
      emit('error', 'Error|Battle: no player found')
    }

    if (!enemy) {
      emit('error', 'Error|Battle: no enemy found')
    }

    // Get combatant abilities and use 
    const ability = getRandomChoice(enemy.abilities);

    if (!ability) {
      emit('error', 'Error|Battle: no abilities found')
    }

    emit('battle.update', { 
      text: `${enemy.name} targets ${player.name} with ${ability.name}`
    });
    debug(`${enemy.name} targets ${player.name} with ${ability.name}`);

    const result = ability.use(enemy, player);
    store.dispatch(hurt('player', result.damage));

    this.checkBattleState();
  }


  checkBattleState()
  {
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;

    if (enemy.health <= 0) {
      // player won battle
      emit('battle.over.win', { battle: this });
    } else if (player.health <= 0) {
      // player lost battle
      emit('battle.over.lose', { battle: this });
    } else {
      // battle continues
      this.getNextCombatant();
    }

  }


  getNextCombatant()
  {
    store.dispatch(nextTurn());
    this.combatantTurnStart();
  }


  // UNUSED
  hit(params)
  {
    const combatant = params.combatant;
    const target = params.target;
    const ability = params.ability;    
    const damage = params.damage; 

    target.healh -= damage;
    target.health = target.health < 0 ? 0 : target.health;

    debug(`Battle: ${combatant.name} hit ${target.name} for ${damage}`);

    const player = combatant.playable ? combatant : target;
    const enemy = combatant.playable ? target : combatant;

    this.player = player;
    this.enemy = enemy;

    emit('battle.update', { 
      player: combatant.playable ? combatant : target,
      enemy: combatant.playable ? target : combatant,
      text: `${combatant.name} hit ${target.name} for ${damage}` 
    });    
  }


  /*
    Escape from battle
    UNUSED
  */
  escape()
  {
    dispatch.emit('battle.end', {
      battle: this,
      condition: 'escape'
    });
  }
}