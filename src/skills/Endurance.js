import Skill from './Skill';

class Endurance extends Skill
{
  constructor(props)
  {
    super(props);
    
    this.name = 'Endurance';
    this.description = 'Controls stamina and capacity to withstand attacks.';
  }
}

export default Endurance;