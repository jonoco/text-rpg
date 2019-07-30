export default class Ability 
{
  constructor(props)
  {
    this.name = '';
    this.description = '';
    this.type = '';
  }

  /**
   * Valid ability categories
   */
  static get Types()
  {
    return {
        physical: 'physical'
      , magic: 'magic'
    }
  }

  use(combatant, target, abilityParameters)
  {

  }
}