import Skill from './Skill';
import Ability from '../abilities/Ability';
import { debug } from '../utility';

class Agility extends Skill
{
  constructor(props)
  {
    super(props);

    this.name = 'Agility';
    this.description = 'Controls speed and contributes to dodge and accuracy.';
    this.level = 0;
  }


  augment(params)
  {
    const { ability, skills, augments } = params;
    const augment = {
      skill: this.name
    }

    debug(`augmenting ${ability.name} with ${this.name}`);

    if (ability.type == Ability.type.physical) {
        augment.damage = Math.floor(1 + this.level * 1.5)
      , augment.damageRatio = 1 + this.level * 0.15
    }

    augments.push(augment);
    return { ability, skills, augments };
  }
}

export default Agility;