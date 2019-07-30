import Skill from './Skill';
import Ability from '../abilities/Ability';
import { debug } from '../utility';

class Strength extends Skill
{
  constructor(props)
  {
    super(props);

    this.name = 'Strength';
    this.description = 'Controls weapon handling and contributes to attack damage.';
    this.level = 0;
  }

  augment(params)
  {
    const { ability, skills, augments } = params;
    const augment = {
      skill: this.name
    }

    debug(`augmenting ${ability.name} with ${this.name}`);

    if (ability.type == Ability.Types.physical) {
        augment.damage = 2
      , augment.damageRatio = 1.1
    }

    augments.push(augment);
    return { ability, skills, augments };
  }
}

export default Strength;