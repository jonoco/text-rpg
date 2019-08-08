import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import { hurt } from '../actions/actions';
import Ability from './Ability';
import { getCharacterEquippedItems } from '../selectors';
import { Item } from '../Item';
import { useAbility } from '../actions/actions';

class Slash extends Ability
{  
  constructor(props)
  {
    super(props);

    this.name = 'Slash';
    this.type = Ability.type.physical;

    this.addItemRequirement(Item.type.slash);
    this.addSkillRequirement('Strength', 0);
  }


  get description()
  {
    const damage = this.getBaseDamage();
    return `Swing a flat object and try not to hurt yourself buttercup.
      \ndamage: ${damage.min} - ${damage.max}
    `
  }


  getBaseDamage()
  {
    const min = Math.floor(8 + this.uses * 0.25);
    const max = Math.floor(12 + this.uses * 0.25);
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

    // Influence chain
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

export default Slash;