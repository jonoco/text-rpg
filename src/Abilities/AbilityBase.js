export const AbilityEnvironment = {
    battle: 'battle'
  , world: 'world'
};

export const AbilityUse = {
    passive: 'passive'
  , active: 'active'
};


/**
 * @param {object} options
 * 
 * name {string} - ability name
 * description {string} - ability description
 * cost {number} - resource cost of using ability
 * environment {AbilityEnvironment} - state which ability can be used
 * activation {AbilityUse} - whether ability is passive or active
 * proficiencyLevels {[number]} - determines when ability levels up
 * accuracy {number} - native accuracy of ability; doesn't affect evasion
 * baseDamage {number} - only relevant for damage causing ability
 */
export class AbilityBase
{
  constructor(options)
  {
    this.name = options.name || 'Ability Name';
    this.description = options.description || 'Description';
    this.cost = options.cost || 0;
    this.environment = options.environment || AbilityEnvironment.battle;
    this.activation = options.activation || AbilityUse.active;
    this.proficiencyLevels = options.proficiencyLevels || [10, 100, 1000];
    this.accuracy = options.accuracy || 100;
    this.baseDamage = options.baseDamage || 0;

    this.uses = 0;
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


 /**
  * Use ability on target
  * 
  * @param {Character} user
  * @param {Character} target
  */
  use(user, target)
  {
    //...
  }


 /**
  * Check whether ability can be used
  * 
  * @param {Character} user
  * @param {Character} target
  */
  checkUse(user, target)
  {
    //...
  }
}