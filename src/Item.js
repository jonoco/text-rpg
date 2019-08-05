import { debug, getRandomInt } from './utility';

/**
 * All attributes of an item
 * @type {object}
 */
const itemAttributes = {
    attack: null
  , defence: null
}

export class Item {
  constructor(name, slot) 
  {
    this.name = name;
    this.id = Math.floor(Math.random()*10000000);
    this.slot = slot;
    this.attributes = itemAttributes;
  }

  setAttributes(attr)
  {
    this.attributes = { ...this.attributes, ...attr };
  }

  static get itemAttributes ()
  {
    return itemAttributes;
  }

  /**
   * Array of valid item slot types
   */
  static get ItemSlots()
  {
    return [
        'head'
      , 'shoulders'
      , 'hands'
      , 'torso'
      , 'legs'
      , 'feet'
      , 'weapon'
      , 'offhand'
      , 'necklace'
      , 'ring'
    ]
  }


  static isValidItemSlot(type)
  {
    return this.ItemSlots.includes(type);
  }


  static createRandomItem()
  {
    let slot = this.ItemSlots[getRandomInt(0, this.ItemSlots.length)];

    let name;
    let defence = 0;
    let attack = 0;
    
    switch (slot)
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
        attack = getRandomInt(2, 8);
        name = 'Sword';
        break;
      case 'offhand':
        defence = getRandomInt(5, 10);
        name = 'Buckler';
        break;
      case 'necklace':
        defence = getRandomInt(2, 5);
        attack = getRandomInt(2, 5);
        name = 'Chain';
        break;
      case 'ring':
        defence = getRandomInt(2, 5);
        attack = getRandomInt(2, 5);
        name = 'Band';
        break;
    }

    const modifiers = [
      'Dazzlement', 'Frogliness', 'Pointiness', 'Vajayjays', 'Befuddlement',
      'Neatness', 'Okayity', 'Sinfulness', 'Somethingy', 'Itemness',
    ];
    name += ` of ${modifiers[getRandomInt(0, modifiers.length)]}`;

    debug(`Generated item name: ${name}`);

    let item = new Item(name, slot);
    item.setAttributes({
      attack,
      defence
    });

    return item;
  }
}