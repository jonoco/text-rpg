import { debug, getRandomInt } from './utility';

export const ItemType = { head: 0, shoulders: 1, hands: 2, torso: 3, legs: 4, 
      feet: 5, weapon: 6, shield: 7, necklace: 8, ring: 9 };

export class Item {
  constructor(name) 
  {
    this.name = name;
    this.type = null;
    this.itemID = Math.floor(Math.random()*100000);

    // Only applicable for weapons
    this.damage = 1;

    this.statModifiers = {
      strength: 0,
      dexterity: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0
    };
  }


  static isValidItemType(type)
  {
    return ItemType.includes(type);
  }


  static createRandomItem()
  {
    let type = Object.keys(ItemType)[getRandomInt(0, Object.keys(ItemType).length)];
    
    debug(type);

    let name;
    let defence = 0;
    let damage = 1;
    let statModifiers = {
      strength: 0,
      dexterity: 0,
      agility: 0,
      endurance: 0,
      intelligence: 0
    };

    switch (type)
    {
      case 'head':
        defence = getRandomInt(1, 7);
        name = 'Helm';
        break;
      case 'shoulders':
        defence = getRandomInt(1, 7);
        name = 'Paldrons';
        break;
      case 'hands':
        defence = getRandomInt(1, 7);
        name = 'Gloves';
        break;
      case 'torso':
        defence = getRandomInt(1, 7);
        name = 'Breastplate';
        break;
      case 'legs':
        defence = getRandomInt(1, 7);
        name = 'Leggings';
        break;
      case 'feet':
        defence = getRandomInt(1, 7);
        name = 'Boots';
        break;
      case 'weapon':
        damage = getRandomInt(2, 8);
        name = 'Sword';
        break;
      case 'shield':
        defence = getRandomInt(5, 10);
        name = 'Buckler';
        break;
      case 'necklace':
        name = 'Chain';
        break;
      case 'ring':
        name = 'Band';
        break;
    }

    const modifiers = [
      'Dazzlement', 'Frogliness', 'Pointiness', 'Vajayjays', 'Befuddlement',
      'Neatness', 'Okayity', 'Sinfulness', 'Something', 'Itemness',
    ];
    name += ` of ${modifiers[getRandomInt(0, modifiers.length)]}`;

    debug(`Generated item name: ${name}`);

    let item = new Item(name);
    item.type = type;
    item.statModifiers = {
      strength: getRandomInt(0,5),
      dexterity: getRandomInt(0,5),
      agility: getRandomInt(0,5),
      endurance: getRandomInt(0,5),
      intelligence: getRandomInt(0,5)
    };
    
    if (type === 'weapon')
    {
      item.damage = damage;
      item.defence = defence;
    }

    return item;
  }
}