export default class Skill
{
  constructor()
  {
    this.name = '';
    this.description = '';
    this.level = 0;
  }


  requiredExperience()
  {
    return 25 + this.level*25;
  }


  augment(params)
  {
    return params;
  }
}