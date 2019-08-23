import Skill from './Skill';

class Vitality extends Skill
{
  constructor(props)
  {
    super(props);
    
    this.name = 'Vitality';
    this.description = 'Improves health and stamina.';
  }
}

export default Vitality;