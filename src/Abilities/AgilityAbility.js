import { AbilityBase, AbilityEnvironment, AbilityUse } from './AbilityBase';

/**
 * Determines evasion and speed
 */
export default class AgilityAbility extends AbilityBase
{
  constructor()
  {
    // Agility has 100 proficiency levels
    const proficiencyLevels = [];
    for (var i = 0; i < 100; i++) {
      proficiencyLevels.push( 10*i );  
    };

    super({
        name: 'Agility'
      , description: 'Determine agility to dodge arrows or commitment. Stop evading your feelings.'
      , activation: AbilityUse.passive
      , environment: AbilityEnvironment.battle
      , proficiencyLevels
    });
  }
}