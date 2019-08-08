
/**
 * itemRequirement
 * {
 *   type: string,      - required type of equipped item
 * }
 */

/**
 * abilityRequirement
 * {
 *   name: string,      - name of learned ability
 *   uses: number       - required minimum number of ability uses
 * }
 */


/**
 * skillRequirement
 * {
 *   name: string,      - name of learned skill
 *   level: number      - required minimum level of skill
 * }
 */

export default class Ability 
{
  constructor(props)
  {
    this.name = '';
    this.description = '';
    this.type = '';
    this.uses = 0;
    this.itemRequirements = [];
    this.skillRequirements = [];
    this.abilityRequirements = [];
  }

  /**
   * Valid ability categories
   */
  static get type()
  {
    return {
      physical: 'physical',
      magic: 'magic'
    }
  }

  addItemRequirement(itemType)
  {
    this.itemRequirements.push({
      type: itemType
    });
  }


  addSkillRequirement(name, level)
  {
    this.skillRequirements.push({
      name, level
    });
  }


  addAbilityRequirement(name, uses)
  {
    this.abilityRequirements.push({
      name, uses
    });
  }


  use(combatant, target, abilityParameters)
  {
    throw new Error('Ability: USE NOT IMPLEMENTED');
  }
}