import { Character } from './Character';
import { on, emit } from './dispatch';
import { getRandomChoice, getRandomInt, debug } from './utility';
import { store } from './main';
import { hurt, heal, nextTurn } from './actions/actions';
import { getCharacterActiveAbilities } from './selectors';

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
      setTimeout(this.autoCombatant.bind(this), 1000);
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
    if (!ability) {
      emit('error', 'Error|Battle: no abilities found')
    }

    emit('battle.update', { 
      text: `{cyan-fg}${player.name}{/} targets {red-fg}${enemy.name}{/} with ${ability.name}`
    });
    debug(`${player.name} targets ${enemy.name} with ${ability.name}`);

    // Influence chain
    const skills = player.skills;
    let abilityParameters = { ability, skills, augments: [] };
    skills.forEach(skill => {
      abilityParameters = skill.augment(abilityParameters)
    });

    const result = ability.use(player, enemy, abilityParameters);
    
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
      return emit('error', 'Error|Battle: no player found')
    }

    if (!enemy) {
      return emit('error', 'Error|Battle: no enemy found')
    }

    // Get combatant abilities and use 
    const abilities = getCharacterActiveAbilities(store.getState(), enemy.character);
    const ability = getRandomChoice(abilities);
    if (!ability) {
      return emit('error', 'Error|Battle: no abilities found')
    }

    emit('battle.update', { 
      text: `{red-fg}${enemy.name}{/} targets {cyan-fg}${player.name}{/} with ${ability.name}`
    });
    debug(`${enemy.name} targets ${player.name} with ${ability.name}`);
    
    // Influence chain
    const skills = enemy.skills;
    let abilityParameters = { ability, skills, augments: [] }
    skills.forEach(skill => {
      abilityParameters = skill.augment(abilityParameters)
    });

    const result = ability.use(enemy, player, abilityParameters);
    
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
}