import { debug, getRandomInt } from './utility';

export const ItemType = { head: 0, shoulders: 1, hands: 2, torso: 3, legs: 4, 
      feet: 5, weapon: 6, shield: 7, necklace: 8, ring: 9 };

export class Item {
  constructor(name) 
  {
    this.name = name;
    this.type = null;
    this.itemID = Math.floor(Math.random()*100000);
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
    switch (type)
    {
      case 'head':
        name = 'Helm'
        break;
      case 'shoulders':
        name = 'Paldrons'
        break;
      case 'hands':
        name = 'Gloves'
        break;
      case 'torso':
        name = 'Breastplate'
        break;
      case 'legs':
        name = 'Leggings'
        break;
      case 'feet':
        name = 'Boots'
        break;
      case 'weapon':
        name = 'Sword'
        break;
      case 'shield':
        name = 'Buckler'
        break;
      case 'necklace':
        name = 'Chain'
        break;
      case 'ring':
        name = 'Band'
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
    return item;
  }
}