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


  initialize(player, enemy)
  {
    this.enemy = enemy || Character.createRandomEnemy();
    this.player = player;

    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player
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
    this.enemy.hit(this.player.attackPower());

    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player
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
    this.player.hit(this.enemy.attackPower());

    dispatch.emit('battle.update', {
      enemy: this.enemy,
      player: this.player
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