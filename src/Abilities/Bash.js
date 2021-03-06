import { getRandomInt, debug } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import Ability from './Ability';
import { getCharacterEquippedItems } from '../selectors';
import { useAbility, hurt,receiveEffect } from '../actions/characterActions';
import { Stunned } from '../effects';

class Bash extends Ability
{  
  constructor(props)
  {
    super(props);

    this.name = 'Bash';
    this.type = Ability.type.physical;
  }

  static get chance()
  {
    return 0.1;
  }


  get description()
  {
    const damage = this.getBaseDamage();
    return `Wail on your enemy with your fists, go ahead and do it, you dumb idiot.
      \ndamage: ${damage.min} - ${damage.max}
      \n${Math.floor(Bash.chance*100)}% chance to stun target.
    `
  }


  getBaseDamage()
  {
    const min = Math.floor(2 + this.uses * 0.25);
    const max = Math.floor(5 + this.uses * 0.25);
    return { min, max }; 
  }

  
  use(combatant, target, abilityParameters)
  {
    // Get attack attributes
    const items = getCharacterEquippedItems(store.getState(), combatant.character);
    const itemAttack = items.reduce((acc, item) => acc + item.attributes.attack, 0);

    let baseDamage = this.getBaseDamage(); 
    let damage = getRandomInt(baseDamage.min, baseDamage.max);

    // Scale damage by attack power
    damage += itemAttack;

    // DEPRECATED
    // Influence chain
    // abilityParameters.augments.forEach(augment => {
    //   damage += augment.damage;  
    //   damage *= augment.damageRatio;
    // });

    damage = Math.floor(damage);

    store.dispatch(hurt(target.character, damage));
    store.dispatch(useAbility(combatant.character, this));
    if (Math.random() < Bash.chance) {
      store.dispatch(receiveEffect(target.character, new Stunned()));
      emit('battle.update', { 
        text: `${target.name} has been stunned by ${this.name}!`
      });
    }
    

    emit('battle.update', { 
      text: `${this.name} hit for {white-fg}${damage}{/} damage`
    });

    debug(`${combatant.name} | ${this.name} hit for {white-fg}${damage}{/} damage`);

    return abilityParameters;
  }
}

export default Bash;