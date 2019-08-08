import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import { hurt } from '../actions/actions';
import Ability from './Ability';
import { useAbility } from '../actions/actions';

class Bite extends Ability
{  
  constructor(props)
  {
    super(props);
    
    this.name = 'Bite';
    this.type = Ability.type.physical;
  }


  get description()
  {
    const damage = this.getBaseDamage();
    return `Chew your enemy with your teeth like a sack of meat.
      \ndamage: ${damage.min} - ${damage.max}
    `
  }


  getBaseDamage()
  {
    const min = Math.floor(2 + this.uses * 0.25);
    const max = Math.floor(12 + this.uses * 0.25);
    return { min, max }; 
  }

  
  use(combatant, target, abilityParameters)
  {
    let baseDamage = this.getBaseDamage(); 
    let damage = getRandomInt(baseDamage.min, baseDamage.max);

    // Inlfuence chain
    abilityParameters.augments.forEach(augment => {
      damage += augment.damage;  
      damage *= augment.damageRatio;
    });

    damage = Math.floor(damage);

    store.dispatch(hurt(target.character, damage));
    store.dispatch(useAbility(combatant.character, this));

    emit('battle.update', { 
      text: `${this.name} hit for {white-fg}${damage}{/} damage`
    });

    return abilityParameters;
  }
}

export default Bite;