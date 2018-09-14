import { Character } from './Character';
import dispatch from './dispatch';

export const BattleCondition = {
  Escape: 0,
  Victory: 1,
  Lose: 2
};


/*
  Handles battle logic
*/
export class Battle {
  constructor(player, enemy)
  {
    dispatch.on('battle.playerAttack', this.attackEnemy.bind(this));
    dispatch.on('battle.escape', this.escape.bind(this));
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
    Escape from battle
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