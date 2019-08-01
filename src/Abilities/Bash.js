import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import { hurt } from '../actions/actions';
import Ability from './Ability';

class Bash extends Ability
{  
  constructor(props)
  {
    super(props);

    this.name = 'Bash';
    this.description = 'Wail on your enemy with your fists, go ahead and do it, you dumb idiot.';
    this.type = Ability.Types.physical;
  }
  
  use(combatant, target, abilityParameters)
  {
    let baseDamage = [5,10]; 
    let damage = getRandomInt(baseDamage[0], baseDamage[1]);

    // Influence chain
    abilityParameters.augments.forEach(augment => {
      damage += augment.damage;  
      damage *= augment.damageRatio;
    });

    damage = Math.floor(damage);

    store.dispatch(hurt(target.character, damage));

    emit('battle.update', { 
      text: `${this.name} hit for {white-fg}${damage}{/} damage`
    });

    return abilityParameters;
  }
}

export default Bash;