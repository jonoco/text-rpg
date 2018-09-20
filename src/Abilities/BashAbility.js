import { AbilityBase, AbilityEnvironment, AbilityUse } from './AbilityBase';


/**
 * Strength based attack with high accuracy
 */
export default class BashAbility extends AbilityBase
{
  constructor()
  {
    super({
        name: 'Bash'
      , description: 'Wail on your enemy with your fists, go ahead and do it, you dumb idiot.'
      , cost: 0
      , activation: AbilityUse.active
      , environment: AbilityEnvironment.battle
      , accuracy: 85
      , baseDamage: 5
    });
  }

  
  use(user, target)
  {
    // Get user's augmented stats to determine power and accuracy
    const userAccuracy = this.accuracy;
  
    // Get target's augment stats to determine defence and evasion
    const targetEvasion = 15;
    
    // Final damage
    let actualDamage = this.baseDamage;
  
    const hitChance = userAccuracy/100;
    const hitSuccess = Math.random() < hitChance;

    if (!hitSuccess)
    {
      user.missHit();
      return `${user.name} missed using ${this.name}!`;
    }

    const dodgeChance = targetEvasion/100;
    const dodgeSuccess = Math.random() < dodgeChance;
    
    if (dodgeSuccess)
    {
      target.dodgeHit();
      return `${target.name} dodged ${this.name}!`;
    }

    // Ability succeeded, apply affects
    target.hit(actualDamage);

    user.abilitySuccessful(this);
    return `${user.name} hit ${target.name} using ${this.name} for ${actualDamage} damage!`;
  }
}