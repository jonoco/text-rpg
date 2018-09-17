export default class AbilityBase
{
  constructor(name, cost, type)
  {
    this.name = name;  // Ability name
    this.cost = cost;  // Resource cost
    this.type = type;  // World, Battle, etc.
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