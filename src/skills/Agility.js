import Skill from './Skill';

class Agility extends Skill
{
  constructor(props)
  {
    super(props);

    this.name = 'Agility';
    this.description = 'Controls speed and contributes to dodge and accuracy.';
    this.level = 0;
  }
}

export default Agility;