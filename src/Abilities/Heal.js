import { getRandomInt, debug } from '../utility';
import { store } from '../main';
import { emit } from '../dispatch';
import Ability from './Ability';
import { getCharacterEquippedItems } from '../selectors';
import { Item } from '../Item';
import { useAbility, hurt, heal } from '../actions/characterActions';

class Heal extends Ability
{  
  constructor(props)
  {
    super(props);

    this.name = 'Heal';
    this.type = Ability.type.magic;
  }


  get description()
  {
    const health = this.getBaseHeal();
    return `Healing yourself to save medical costs.
      \nhealth: ${health.min} - ${health.max}
    `
  }


  getBaseHeal()
  {
    const min = Math.floor(8 + this.uses * 0.25);
    const max = Math.floor(12 + this.uses * 0.25);
    return { min, max }; 
  }

  
  use(combatant, target, abilityParameters)
  {
    // Get attack attributes
    const items = getCharacterEquippedItems(store.getState(), combatant.character);
    const itemMagic = items.reduce((acc, item) => acc + item.attributes.magic, 0);

    debug(`Heal | itemMagic ${itemMagic}`);
  
    let baseHealth = this.getBaseHeal(); 
    let health = getRandomInt(baseHealth.min, baseHealth.max);

    // Scale damage by attack power
    health += itemMagic ? itemMagic : 0;

    // Influence chain
    abilityParameters.augments.forEach(augment => {
      health += augment.health || 0;  
      health *= augment.healthRatio || 1;
    });

    debug(`healing ${combatant.name} for ${health}`);

    health = Math.floor(health);

    store.dispatch(heal(combatant.character, health));
    store.dispatch(useAbility(combatant.character, this));

    emit('battle.update', { 
      text: `${this.name} healed for {white-fg}${health}{/} health`
    });

    return abilityParameters;
  }
}

export default Heal;