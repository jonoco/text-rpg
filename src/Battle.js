import { Character } from './Character';
import { on, emit } from './dispatch';
import { getRandomChoice, getRandomInt, debug } from './utility';

/*
  Handles battle logic
*/
export class Battle {
  constructor(props)
  {
    this.game = props.game;
    
    // all battling characters
    this.player;
    this.enemy;

    this.isPlayerTurn;

    on('battle.initialize', this.initialize.bind(this));

    on('battle.player.finish', this.playerCombatant.bind(this));
  }

  
  /*
    Initialize a new battle
  */
  initialize(params)
  {
    // setup battle conditions
    this.player = params.player;
    this.enemy = params.enemy;
    this.isPlayerTurn = true;

    // start the battle
    emit('battle.start', { player: this.player, enemy: this.enemy });
    this.combatantTurnStart();
  }


  combatantTurnStart()
  {
    if (this.isPlayerTurn) {
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
    const abilityName = params.ability;
    const ability = this.player.abilities.find(a => abilityName == a.name);
    
    emit('battle.update', { 
      player: this.player,
      enemy: this.enemy,
      text: `${this.player.name} targets ${this.enemy.name} with ${ability.name}`
    });
    debug(`${this.player.name} targets ${this.enemy.name} with ${ability.name}`);

    const result = ability.use(this.player, this.enemy);
    this.hit(result);

    this.checkBattleState();
  }

  /**
   * AI combat routine
   */
  autoCombatant()
  {
   
    // Get combatant abilities and use 
    const ability = getRandomChoice(this.enemy.getAbilities());

    emit('battle.update', { 
      player: this.player,
      enemy: this.enemy,
      text: `${this.enemy.name} targets ${this.player.name} with ${ability.name}`
    });
    debug(`${this.enemy.name} targets ${this.player.name} with ${ability.name}`);

    const result = ability.use(this.enemy, this.player);
    this.hit(result);

    this.checkBattleState();
  }


  checkBattleState()
  {
    if (!this.enemy.isAlive()) {
      // player won battle
      emit('battle.over.win', { battle: this });
    } else if (!this.player.isAlive()) {
      // player lost battle
      emit('battle.over.lose', { battle: this });
    } else {
      // battle continues
      this.getNextCombatant();
    }

  }


  getNextCombatant()
  {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.combatantTurnStart();
  }


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
      condition: BattleCondition.Escape
    });
  }
}