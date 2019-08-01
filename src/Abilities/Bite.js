import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import { hurt } from '../actions/actions';
import Ability from './Ability';

class Bite extends Ability
{  
  constructor(props)
  {
    super(props);
    
    this.name = 'Bite';
    this.description = 'Chew your enemy with your teeth like a sack of meat.';
    this.type = Ability.Types.physical;
  }
  
  use(combatant, target, abilityParameters)
  {
    let baseDamage = [2,12]; 
    let damage = getRandomInt(baseDamage[0], baseDamage[1]);

    // Inlfuence chain
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

export default Bite;