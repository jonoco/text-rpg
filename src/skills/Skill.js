import { quadratic } from '../utility'; 


export default class Skill
{
  constructor(level = 0)
  {
    this.name = '';
    this.description = '';
    this.level = level;
    this.multiplier = 25;
    this.base = 25;
  }


  getModifier()
  {
    return (Math.floor(this.level/2) - 5)
  }


  // AUDIT
  requiredExperience()
  {
    return this.base + this.level*this.multiplier;
  }


  /**
   * Returns the maximum level for a given experience allotment
   */
  // AUDIT
  maximumLevel(experience)
  {
    return Math.floor(quadratic(this.multiplier/2, this.base/2, -experience).r1);
  }


  // AUDIT
  augment(params)
  {
    return params;
  }
}