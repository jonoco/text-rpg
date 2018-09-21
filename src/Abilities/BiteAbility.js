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
      , description: 'Chew on your enemy like a sausage. Yum.'
      , cost: 0
      , activation: AbilityUse.active
      , environment: AbilityEnvironment.battle
      , accuracy: 45
      , baseDamage: 9
    });
  }

  
  use(user, target)
  {
    const strength = user.getAbility('Strength');

    // Get target's augment stats to determine defence and evasion
    const targetEndurance = target.getAbility('Endurance');
    const targetAgility = target.getAbility('Agility');
    const targetEvasion = targetAgility.getProficiency();

    // Final damage
    let actualDamage = this.baseDamage;
    actualDamage += strength ? strength.getProficiency() : 0;

    // Get user's augmented stats to determine power and accuracy
    const userAccuracy = this.accuracy;
  
    const hitChance = userAccuracy/100;
    const hitMiss = Math.random() > hitChance;

    // User missed attack
    if (hitMiss)
    {
      user.missHit();
      return `${user.name} missed using ${this.name}!`;
    }

    const dodgeChance = targetEvasion/100;
    const dodgeMiss = Math.random() > dodgeChance;
    
    // Target dodged attack
    if (!dodgeMiss)
    {
      targetAgility.uses++;
      target.dodgeHit();
      return `${target.name} dodged ${this.name}!`;
    }

    // Ability succeeded, apply affects
    target.hit(actualDamage);
    
    this.uses++;
    strength.uses++;        // every use improves strength
    targetEndurance.uses++; // improve target's endurance

    user.abilitySuccessful(this);
    return `${user.name} hit ${target.name} using ${this.name} for ${actualDamage} damage!`;
  }
}