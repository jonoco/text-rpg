import { Character } from './Character';
import dispatch from './dispatch';
import { getRandomChoice } from './utility';

export const BattleCondition = {
  Escape: 0,
  Victory: 1,
  Lose: 2
};


const BattleState = {
  PlayerTurn: 0,
  EnemyTurn: 1,
  BattleOver: 2
};


/*
  Handles battle logic
*/
export class Battle {
  constructor(player, enemy)
  {
    // deprecated
    dispatch.on('battle.playerAttack', this.attackEnemy.bind(this));
    // deprecated
    dispatch.on('battle.escape', this.escape.bind(this));
    
    dispatch.on('battle.useAbility', this.playerUseAbility.bind(this));
  }

  
  /*
    Initialize a new battle
  */
  initialize(player, enemy)
  {
    this.enemy = enemy || Character.createRandomEnemy();
    this.player = player;

    dispatch.emit('battle.start', {
      enemy: this.enemy,
      player: this.player,
      text: `Encountered a ${this.enemy.name}!`
    });
  }


  /*
    Use an ability by the player
  */
  playerUseAbility(event)
  {
    const ability = this.player.abilities.find(ability => ability.name == event.ability)

    this.useAbility(ability, this.player, this.enemy);
    
    if (!this.enemy.isAlive())
    {
      dispatch.emit('battle.end', {
        battle: this,
        condition: BattleCondition.Victory
      });
    }
    else
    {
      this.enemyUseAbility();
    }
  }


  /*
    Use an ability by the enemy
  */
  enemyUseAbility()
  {
    // Get a random valid ability from enemy and use it
    const ability = getRandomChoice(this.enemy.abilities); // lazy method

    this.useAbility(ability, this.enemy, this.player);

    if (!this.player.isAlive())
    {
      dispatch.emit('battle.end', {
        battle: this,
        condition: BattleCondition.Lose
      });
    }
  }


  /*
    Use a character ability
  */
  useAbility(ability, user, target)
  {
    const result = ability.use(user, target);
    
    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player,
      text: result
    });

    // dispatch.emit('battle.log', { text: result });
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

  
  /*
    Get attack selection from event
    DEPRECATED
  */
  attackEnemy(event)
  {
    const damage = this.enemy.hit(this.player.attackPower());

    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player,
      text: `${this.enemy.name} hit for ${damage}`
    });

    if (!this.enemy.isAlive())
    {
      dispatch.emit('battle.end', {
        battle: this,
        condition: BattleCondition.Victory
      });
    }
    else
    {
      this.attackPlayer();
    }
  }

  
  // Enemy attacks player
  // DEPRECATED
  attackPlayer()
  {
    const damage = this.player.hit(this.enemy.attackPower());

    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player,
      text: `${this.player.name} hit for ${damage}`
    });

    if (!this.player.isAlive())
    {
      dispatch.emit('battle.end', {
        battle: this,
        condition: BattleCondition.Lose
      });
    }
  }
}