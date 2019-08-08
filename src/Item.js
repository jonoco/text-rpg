import { debug, getRandomInt } from './utility';

/**
 * All attributes of an item
 * @type {object}
 */
const itemAttributes = {
    attack: null
  , defence: null
}

const itemType = {
    slash: 'slash'
  , blunt: 'blunt'
  , shield: 'shield'
  , armor: 'armor'
  , jewelery: 'jewelery'
}

export class Item {
  constructor() 
  {
    this.name = '';
    this.id = Math.floor(Math.random()*10000000);
    this.slot = '';
    this.attributes = itemAttributes;
    this.type = null;
  }

  setAttributes(attr)
  {
    this.attributes = { ...this.attributes, ...attr };
  }

  static get type() {
    return itemType;
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

    let item = new Item();
    item.slot = slot;

    switch (slot)
    {
      case 'head':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Helm';
        break;
      case 'shoulders':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Paldrons';
        break;
      case 'hands':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Gloves';
        break;
      case 'torso':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Breastplate';
        break;
      case 'legs':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Leggings';
        break;
      case 'feet':
        item.type = Item.type.armor;
        defence = getRandomInt(1, 7);
        name = 'Boots';
        break;
      case 'weapon':
        item.type = Item.type.slash;
        attack = getRandomInt(2, 8);
        name = 'Sword';
        break;
      case 'offhand':
        item.type = Item.type.shield;
        defence = getRandomInt(5, 10);
        name = 'Buckler';
        break;
      case 'necklace':
        item.type = Item.type.jewelery;
        defence = getRandomInt(2, 5);
        attack = getRandomInt(2, 5);
        name = 'Chain';
        break;
      case 'ring':
        item.type = Item.type.jewelery;
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

    item.name = name;

    item.setAttributes({
      attack,
      defence
    });

    return item;
  }
}