import { AbilityBase, AbilityEnvironment, AbilityUse } from './AbilityBase';

/**
 * Provide power for strength based abilities
 */
export default class StrengthAbility extends AbilityBase
{
  constructor()
  {
    // Strength has 100 proficiency levels
    const proficiencyLevels = [];
    for (var i = 0; i < 100; i++) {
      proficiencyLevels.push( 10*i );  
    };

    super({
        name: 'Strength'
      , description: 'Provides power to hit things or show your love of lifting objects.'
      , activation: AbilityUse.passive
      , environment: AbilityEnvironment.battle
      , proficiencyLevels
    });
  }
}