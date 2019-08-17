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
    on('battle.initialize', this.initialize.bind(this));
    on('battle.player.finish', this.playerCombatant.bind(this));
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
  initialize()
  {
    // start the battle
    emit('battle.start');
    this.combatantTurnStart();
  }


  combatantTurnStart()
  {
    store.dispatch(clearExpiredEffects(store.getState().player.character.character));
    store.dispatch(clearExpiredEffects(store.getState().enemy.character.character));

    const isPlayerTurn = store.getState().battle.isPlayerTurn;
    if (isPlayerTurn) {
      let skipTurn = false;
      const player = store.getState().player.character;
      const effects = player.effects;
      effects.forEach(effect => {
        if (effect.name == 'Stun')
        {
          emit('battle.update', { 
            text: `{cyan-fg}${player.name}{/} is stunned!`
          });
          
          store.dispatch(incrementEffect(player.character, effect));
          skipTurn = true;
        }
      })

      if (skipTurn)
        return this.checkBattleState();

      // allow ui control
      emit('battle.player.start');
    } else {
      let skipTurn = false;
      const enemy = store.getState().enemy.character;
      const effects = enemy.effects;
      effects.forEach(effect => {
        if (effect.name == 'Stun')
        {
          emit('battle.update', { 
            text: `{cyan-fg}${enemy.name}{/} is stunned!`
          });
          
          store.dispatch(incrementEffect(enemy.character, effect));
          skipTurn = true;
        }
      })

      if (skipTurn)
        return this.checkBattleState();

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

    // Check active effects
    // clearExpiredEffects(player);

    // let skipTurn = false;
    // const effects = store.getState().player.character.effects;
    // effects.forEach(effect => {
    //   if (effect.name == 'Stun')
    //   {
    //     emit('battle.update', { 
    //       text: `{cyan-fg}${player.name}{/} is stunned!`
    //     });
        
    //     store.dispatch(incrementEffect(player.character, effect));
    //     skipTurn = true;
    //   }
    // })

    // if (skipTurn)
    //   return this.checkBattleState();

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
      emit('battle.over.win', { battle: this, enemy });
    } else if (player.health <= 0) {
      // player lost battle
      emit('battle.over.lose', { battle: this, enemy });
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