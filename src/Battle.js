import { Character } from './Character';
import { on, emit } from './dispatch';
import { getRandomChoice, getRandomInt, debug } from './utility';
import { store } from './main';
import { nextTurn } from './actions/gameActions';
import { hurt, heal, incrementEffect, clearExpiredEffects } from './actions/characterActions';
import { getCharacterActiveAbilities } from './selectors';

/*
  Handles battle logic
*/
export class Battle {
  constructor(props)
  {
    this.game = props.game;
  }

  /**
   * Initialize object
   */
  start()
  {
    on('battle.player.ability', this.playerCombatant.bind(this));
  }

  /**
   * Load resources
   */
  async load()
  {
    //
  }

  
  /*
    Initialize a new battle
  */
  startBattle()
  {
    // start the battle
    emit('battle.start');
    this.getNextCombatant();
  }


  combatantTurnStart()
  {
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;
    const characters = [player, enemy]
    characters.forEach(char => store.dispatch(clearExpiredEffects(char.character)));

    const { characterTurn } = store.getState().battle;
    const combatant = characters.find(char => char.character === characterTurn);
    
    let skipTurn = false;
    combatant.effects.forEach(effect => {
      switch (effect.name) {
        case 'Stun': 
          emit('battle.update', { 
            text: `{cyan-fg}${combatant.name}{/} is stunned!`
          });
          skipTurn = true;
          break;
        case 'Poison':
          emit('battle.update', { 
            text: `{cyan-fg}${combatant.name}{/} is poisoned!`
          });
          store.dispatch(hurt(combatant.character, 5));
          break;
      }
      store.dispatch(incrementEffect(combatant.character, effect));
    })

    if (skipTurn)
      return this.checkBattleState();

    if (combatant.playable)
      emit('battle.player.start'); // allow and wait for player input
    else
      setTimeout(this.autoCombatant.bind(this), 1000);
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
      this.game.battleOver(this, enemy, true);
    } else if (player.health <= 0) {
      // player lost battle
      this.game.battleOver(this, enemy, false);
    } else {
      // battle continues
      this.getNextCombatant();
    }
  }


  getNextCombatant()
  {
    const { characterTurn } = store.getState().battle;
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;
    const characters = [player, enemy];
    const nextCombatant = characters.find(char => char.character !== characterTurn);
    
    
    store.dispatch(nextTurn(nextCombatant.character));
    this.combatantTurnStart();
  }
}