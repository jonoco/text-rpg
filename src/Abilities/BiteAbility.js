import { AbilityBase, AbilityEnvironment, AbilityUse } from './AbilityBase';

/**
 * Strength based attack with low accuracy
 */
export default class BashAbility extends AbilityBase
{
  constructor()
  {
    super({
        name: 'Bite'
      , description: 'Chew on your enemy like a sausage.'
      , cost: 0
      , activation: AbilityUse.active
      , environment: AbilityEnvironment.battle
      , accuracy: 45
      , baseDamage: 9
    });
  }

  
  use(user, target)
  {
    const strengthAbility = user.getAbility('Strength');

    // Final damage
    let actualDamage = this.baseDamage;
    actualDamage += strengthAbility ? strengthAbility.getProficiency() : 0;

    // Get user's augmented stats to determine power and accuracy
    const userAccuracy = this.accuracy;
  
    // Get target's augment stats to determine defence and evasion
    const targetEvasion = 15;
  
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
    
    this.uses++;
    user.abilitySuccessful(this);
    return `${user.name} hit ${target.name} using ${this.name} for ${actualDamage} damage!`;
  }
}