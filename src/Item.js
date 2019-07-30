import { debug, getRandomInt } from './utility';


export class Item {
  constructor(name, slot) 
  {
    this.name = name;
    this.id = Math.floor(Math.random()*10000000);
    this.slot = slot;
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
    let damage = 1;
    
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
        damage = getRandomInt(2, 8);
        name = 'Sword';
        break;
      case 'offhand':
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

    let item = new Item(name, slot);
    
    if (slot === 'weapon')
    {
      item.damage = damage;
      item.defence = defence;
    }

    return item;
  }
}