import { emit } from '../utility';

class Bash {  
  constructor()
  {
    this.name = 'Bash';
    this.description = 'Wail on your enemy with your fists, go ahead and do it, you dumb idiot.';
    this.damage = 10;  
  }
  
  use(combatant, target)
  {
    return { 
        ability: this
      , combatant
      , target
      , damage: this.damage 
    };
  }
}

export default Bash;