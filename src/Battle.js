import { Character } from './Character';
import { on, emit } from './dispatch';
import { getRandomChoice, getRandomInt, debug } from './utility';
import { store } from './main';
import { nextTurn } from './actions/gameActions';
import { hurt, heal, incrementEffect, clearExpiredEffects } from './actions/characterActions';
import { getCharacterActiveAbilities } from './selectors';


/**
 * Handles battle logic 
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

  
  /**
   * Initialize a new battle 
   */
  startBattle()
  {
    // start the battle
    emit('battle.start');
    this.getNextCombatant();
  }


  /**
   * Perform initial combat bahvior
   */
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

    this.attack(player, enemy, ability);
  }


  /**
   * AI combat routine
   */
  autoCombatant()
  {
    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;

    // Get combatant abilities and use 
    const abilities = getCharacterActiveAbilities(store.getState(), enemy.character);
    const ability = getRandomChoice(abilities);
    if (!ability) {
      return emit('error', 'Error|Battle: no abilities found')
    }
  
    this.attack(enemy, player, ability);
  }


  /**
   * Use an ability by the combatant on the target
   */
  attack(combatant, target, ability)
  {
    emit('battle.update', { 
      text: `{cyan-fg}${combatant.name}{/} targets {red-fg}${target.name}{/} with {white-fg}${ability.name}{/}`
    });
    debug(`${combatant.name} targets ${target.name} with ${ability.name}`);

    // Influence chain
    const skills = combatant.skills;
    let abilityParameters = { ability, skills, augments: [], effects: combatant.effects };
    skills.forEach(skill => {
      abilityParameters = skill.augment(abilityParameters)
    });

    const result = ability.use(combatant, target, abilityParameters);
    
    this.checkBattleState();
  }


  /**
   * Check if battle is over or continues
   */
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


  /**
   * Get the next character
   */
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