import { getRandomInt } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import { hurt } from '../actions/actions';
import Ability from './Ability';
import { getCharacterEquippedItems } from '../selectors';

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
    // Get attack attributes
    const items = getCharacterEquippedItems(store.getState(), combatant.character);
    const itemAttack = items.reduce((acc, item) => acc + item.attributes.attack, 0);

    let baseDamage = [5,10]; 
    let damage = getRandomInt(baseDamage[0], baseDamage[1]);

    // Scale damage by attack power
    damage += itemAttack;

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