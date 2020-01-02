import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import Ability from './Ability';
import { useAbility, hurt } from '../actions/characterActions';

class Slap extends Ability
{  
  constructor(props)
  {
    super(props);
    
    this.name = 'Slap';
    this.type = Ability.type.physical;
  }


  get description()
  {
    const damage = this.getBaseDamage();
    return `Show your enemy the power of a flat object swung violently.
      \ndamage: ${damage.min} - ${damage.max}
    `
  }


  getBaseDamage()
  {
    const min = Math.floor(4 + this.uses * 0.25);
    const max = Math.floor(12 + this.uses * 0.25);
    return { min, max }; 
  }

  
  use(combatant, target, abilityParameters)
  {
    let baseDamage = this.getBaseDamage(); 
    let damage = getRandomInt(baseDamage.min, baseDamage.max);

    // Inlfuence chain
    // abilityParameters.augments.forEach(augment => {
    //   damage += augment.damage;  
    //   damage *= augment.damageRatio;
    // });

    damage = Math.floor(damage);

    store.dispatch(hurt(target.character, damage));
    store.dispatch(useAbility(combatant.character, this));

    emit('battle.update', { 
      text: `${this.name} hit for {white-fg}${damage}{/} damage`
    });

    return abilityParameters;
  }
}

export default Slap;