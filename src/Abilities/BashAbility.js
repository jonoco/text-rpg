import AbilityBase from './AbilityBase';

export default class BashAbility extends AbilityBase
{
  constructor()
  {
    super('Bash', 0, 'Battle');

    this.baseDamage = 5;
  }

  
  use(user, target)
  {
    // Get user's augmented stats to determine power and accuracy
    const userAccuracy = 85;
  
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