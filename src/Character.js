import inquirer from 'inquirer';
import { message, getRandomInt, getRandomChoice, clearScreen, debug } from './utility';
import { CANCEL } from './constants';
import { emit, on } from './dispatch';

export class Character {
  constructor(name, defaultHealth, playable = false)
  {
    this.id = getRandomInt(0, 10000000);
    this.name = name;
    this.defaultHealth = defaultHealth;
    this.health = this.defaultHealth;

    this.playable = playable;

    this.statusEffects = {
      poisoned: false,
      cursed: false,
      paralyzed: false,
      insane: false,
      afraid: false,
    };

    // type indicates the type of items the slot allows
    this.equipment = {
      head:       { item: null, type: ['head'] },
      shoulders:  { item: null, type: ['shoulders'] },
      hands:      { item: null, type: ['hands'] },
      torso:      { item: null, type: ['torso'] },
      legs:       { item: null, type: ['legs'] },
      feet:       { item: null, type: ['feet'] },
      leftHand:   { item: null, type: ['weapon', 'shield'] },
      rightHand:  { item: null, type: ['weapon', 'shield'] },
      neck:       { item: null, type: ['necklace'] },
      ring1:      { item: null, type: ['ring'] },
      ring2:      { item: null, type: ['ring'] },
      ring3:      { item: null, type: ['ring'] },
      ring4:      { item: null, type: ['ring'] },
    };
    this.inventory = [];

    this.skillPoints = 0;
  
    this.level = 0;
    this.experience = 0;

    // Base stats only changed by leveling up
    this.baseStats = {
      strength: 1,
      dexterity: 1,
      agility: 1,
      endurance: 1,
      intelligence: 1
    };
    
    // Stat modifiers from equipment or status effects
    this.statModifiers = {
      strength: 0,
      dexterity: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0
    };
  }


  /*
    Check if character can level up
  */
  checkLevelup()
  {
    let highestLevel;
    for (let i = 0; i < 99; i++)
    {
      if (this.experience > (100 * i^2))
        highestLevel = i + 1;
      else
        break;
    }
    
    for (let level = 0; level < highestLevel - this.level; level++)
    {
      this.levelup();
    }
  }


  /*
    Increase player stats
  */
  levelup()
  {
    this.level++;
    this.skillPoints += 5;
    this.health = this.defaultHealth;

    this.checkStatModifiers();
  }


  /*
    Get the experience point value of killing this character
  */
  getExperienceValue()
  {
    return 50 + (this.level * 25);
  }


  /*
    Returns array of equipment slots which accept a given item
  */
  getValidEquipmentSlots(item)
  {
    let validSlots = [];

    if (!item)
      return validSlots;
    
    for (let slot in this.equipment)
    {
      if (this.equipment[slot].type.includes(item.type))
        validSlots.push(slot);
    }

    return validSlots;
  }


  /*
    Calculate current stat modifiers
  */
  checkStatModifiers()
  {
    let statModifiers = {
      strength: 0,
      dexterity: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0
    };

    for (var slot in this.equipment)
    {
      if (this.equipment[slot].item)
      {
        let item = this.equipment[slot].item;
        for (var stat in item.statModifiers)
        {
          statModifiers[stat] += item.statModifiers[stat];
        }
      }
    }

    this.statModifiers = statModifiers;

    return statModifiers;
  }


  attackPower()
  {
    let damage = 1;
    if (this.equipment.rightHand.item)
    {
      damage = this.equipment.rightHand.item.damage;
    }
    
    const minDamage = ((this.statModifiers.strength + this.baseStats.strength) / 2) + damage;
    const maxDamage = ((this.statModifiers.strength + this.baseStats.strength) * 1.5) + damage;

    return getRandomInt(minDamage, maxDamage+1);
  }


  // DEPRECATED - use Battle implementation
  hit(result)
  {
    const ability = result.ability;
    const combatant = result.combatant;
    const target = result.target;
    const damage = result.damage;

    debug(`Character: ${combatant.name} hit ${target.name} for ${damage}`);

    this.hurt(damage);

    emit('battle.update', { 
      combatants: [combatant, target], 
      text: `${combatant.name} hit ${target.name} for ${damage}` 
    });    
  }


  abilitySuccessful(ability)
  {
    //...
  }


  missHit()
  {
    //...
  }


  dodgeHit()
  {
    //...
  }


  hurt(damage)
  {
    debug(`${this.name} hurt for ${damage}`);

    this.healh -= damage;
    this.health = this.health < 0 ? 0 : this.health;
  }


  heal(hp)
  {
    debug(`${this.name} healed for ${hp}`);

    this.health += hp;
    this.health = this.health > this.defaultHealth ? this.defaultHealth : this.health;
  }


  isAlive()
  {
    return this.health > 0;
  }


  receiveItem(item)
  {
    this.inventory.push(item);
  }


  /*
    Equip item in first available slot
    Fails if no slots are empty
    Return true if equip was successful, otherwise false
  */
  equipItem(item)
  {
    if (!item) return false;

    let selectedSlot;
    for (let slot in this.equipment)
    {
      if (!this.equipment[slot].item && this.equipment[slot].type.includes(item.type))
      {
        selectedSlot = slot;
        break;
      }
    }

    return selectedSlot ? this.equipItemInSlot(item, selectedSlot) : false;
  }


  /*
    Equip item at a given slot
    If slot is invalid, equip is cancelled
    If slot is occupied, item is swapped and placed in inventory

    Returns true if equip was successful, otherwise false
  */
  equipItemInSlot(item, slot)
  {
    // Check valid slot
    // if (!Object.keys(this.equipment).includes(slot)) return false;

    // Check item is valid for equipment slot
    if (!this.equipment[slot].type.includes(item.type)) return false;
  
    this.unequipItem(slot);

    // Move item from inventory to equipment
    this.equipment[slot].item = item;
    this.removeItemFromInventory(item);

    // Update stat modifiers
    this.checkStatModifiers();

    return true;
  }

  /*
    Unequip item from a slot and return it to inventory
  */
  unequipItem(slot)
  {
    // If slot isn't empty, send item to inventory
    if (this.equipment[slot].item)
    {
      this.inventory.push(this.equipment[slot].item);  
      this.equipment[slot].item = null;
    }
  }


  /*
    Get item info from equipment slot, null if slot is empty
  */
  getItemFromSlot(slot)
  {
    return this.equipment[slot].item;
  }


  /*
    Delete item from invnetory
  */
  removeItemFromInventory(itemToRemove)
  {
    debug(`Removing: `);
    debug(itemToRemove);

    this.inventory = this.inventory.filter(item => item.itemID != itemToRemove.itemID);
  }


  /*
    Create a random character
  */
  static createRandomEnemy()
  {
    const names = ['Goblin', 'Slime', 'Bandit', 'Wolf'];
    const health = getRandomInt(20, 40);
    let enemy = new Character(getRandomChoice(names), health);
    enemy.level = getRandomInt(1, 4);
    enemy.baseStats = {
      strength:     getRandomInt(1, enemy.level),
      dexterity:    getRandomInt(1, enemy.level),
      agility:      getRandomInt(1, enemy.level),
      endurance:    getRandomInt(1, enemy.level),
      intelligence: getRandomInt(1, enemy.level)
    };

    return enemy;
  }

  /**
   * Returns a list of active abilities
   */
  getActiveAbilities()
  {
    return this.abilities.filter(ability => ability.activation == AbilityUse.active);
  }

  getAbilities()
  {
    return this.abilities;
  }

  getSkills()
  {
    return this.skills;
  }


  /**
   * Retrieve an ability by name if it exists
   */
  getAbility(name)
  {
    return this.abilities.find(ability => ability.name.toLowerCase() == name.toLowerCase());
  }
}