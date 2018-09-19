export const AbilityType = {
  battle: 'battle',
  world: 'world'
};

export class AbilityBase
{
  constructor(options)
  {
    this.name = options.name || 'Ability Name';  // Ability name
    this.description = options.description || 'Description'
    this.cost = options.cost || 0;               // Resource cost
    this.type = options.type || AbilityType.battle;
    this.active = options.active || true;    // active or passive ability
    this.uses = 0;
    this.proficiencyLevels = [10, 100, 1000]; // level tiers with use

    this.baseDamage = 0;
  }

  /*
    Returns highest proficiency level of ability
  */
  getProficiency()
  {
    let level = 0;
    for (let i = 0; i < this.proficiencyLevels.length; i++)
    {
      if (this.uses >= this.proficiencyLevels[i])
        level = i + 1;
    }

    return level;
  }


  /*
    Returns uses needed for next proficiency level, or indicate mastered
  */
  getRequiredProficiency()
  {
    let level = this.getProficiency();
    
    return level == this.proficiencyLevels.length ? 'mastered' : this.proficiencyLevels[level];
  }

  /*
    Use ability on target
  */
  use(user, target)
  {
    //...
  }


  /*
    Check whether ability can be used
  */
  checkUse(user, target)
  {
    //...
  }
}