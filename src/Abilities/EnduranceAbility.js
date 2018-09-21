import { AbilityBase, AbilityEnvironment, AbilityUse } from './AbilityBase';

/**
 * Determines health and resistance
 */
export default class EnduranceAbility extends AbilityBase
{
  constructor()
  {
    // Endurance has 100 proficiency levels
    const proficiencyLevels = [];
    for (var i = 0; i < 100; i++) {
      proficiencyLevels.push( 10*i );  
    };

    super({
        name: 'Endurance'
      , description: 'Provides resistance against getting pinched and sick.'
      , activation: AbilityUse.passive
      , environment: AbilityEnvironment.battle
      , proficiencyLevels
    });
  }
}