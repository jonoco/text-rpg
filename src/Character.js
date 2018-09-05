import inquirer from 'inquirer';
import { message, getRandomInt, getRandomChoice, clearScreen, debug } from './utility';
import { CANCEL } from './constants'

export class Character {
  constructor(name, defaultHealth)
  {
    this.name = name;
    this.defaultHealth = defaultHealth;
    this.health = this.defaultHealth;

    this.statusEffects = {
      poisoned: false,
      cursed: false,
      paralyzed: false,
      insane: false,
      afraid: false,
    };

    // type indicates the type of item the slot allows
    this.equipment = {
      head:       { item: null, type: 'head' },
      shoulders:  { item: null, type: 'shoulders' },
      hands:      { item: null, type: 'hands' },
      torso:      { item: null, type: 'torso' },
      legs:       { item: null, type: 'legs' },
      feet:       { item: null, type: 'feet' },
      leftHand:   { item: null, type: 'shield' },
      rightHand:  { item: null, type: 'weapon' },
      neck:       { item: null, type: 'necklace' },
      ring1:      { item: null, type: 'ring' },
      ring2:      { item: null, type: 'ring' },
      ring3:      { item: null, type: 'ring' },
      ring4:      { item: null, type: 'ring' },
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

    message(`${this.name} leveled up to ${this.level}!`);

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


  hit(damage)
  {
    message(`${this.name} was hit for ${damage}`);

    this.health -= damage;
    this.health = this.health < 0 ? 0 : this.health;
  }


  heal(hp)
  {
    this.health += hp;
    this.health = this.health > this.defaultHealth ? this.defaultHealth : this.health;
  }


  isAlive()
  {
    return this.health > 0;
  }


  receiveItem(item)
  {
    message(`You received ${item.name}.`);

    this.inventory.push(item);
  }


  /*
    Prints character status
  */
  async checkStatus()
  {
    clearScreen();
    message(`---------=---------\nStats\n---------=---------`);
    message(`health: ${this.health}`);

    for (let stat in this.baseStats)
    {
      message(`${stat}: ${this.baseStats[stat] + this.statModifiers[stat]}`);
    }

    message(`---------=---------\nStatus effects\n---------=---------`);
    for (let effect in this.statusEffects)
    {
      if (this.statusEffects[effect]) message(effect);
    }

    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'Finished?',
        choices: [
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        //...
      });
  }


  async checkInventory()
  {
    clearScreen();
    message(`---------=---------\nInventory\n---------=---------`);
    
    if (this.inventory.length == 0)
    {
      message('Inventory empty.')
    }
    else
    {
      this.inventory.forEach(item => {
        message(`${item.name} - ${item.type}`);
        debug(`${item.itemID}`);
      });  
    }
    
    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'Finished?',
        choices: [
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        //...
      });
  }


  /*
    Ask user to change item in equipment slot
  */
  async changeEquipment()
  {
    clearScreen();
    message(`---------=---------\nEquipment\n---------=---------`);

    let choices = [];
    for (let slot in this.equipment) {
      let choice = {
        name: `${slot}: ${this.equipment[slot].item 
          ? this.equipment[slot].item.name : 'empty'}`,
        value: slot
      };
      choices.push(choice);
    };
  
    // Get slot to swap out
    let slotSelected;
    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'slot',
        message: 'Which slot do you want to change?',
        choices: [
          ...choices,
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        slotSelected = answers.slot;
        debug(`Item type selected: ${slotSelected}`);
      });
    if (slotSelected === CANCEL) return;
    
    // Ask for item from inventory to swap in
    let item = await this.selectItem(this.equipment[slotSelected].type);
    
    // Swap item in equipment
    if (item != CANCEL)
    {
        debug(`Swapping ${item.name} ${item.itemID}.`);

        // If slot isn't empty, send item to inventory
        if (this.equipment[slotSelected].item)
        {
          this.inventory.push(this.equipment[slotSelected].item);  
        }

        // Move item from invnetory to equipment
        this.equipment[slotSelected].item = item;
        this.removeItemFromInventory(item);

        // Update stat modifiers
        this.checkStatModifiers();
    }
    else // Try again
    {
      await this.changeEquipment();
    }
  }

  async selectItem(type = null)
  {
    // Gives a list of items from the inventory matching the type
    // Show all items if type is null
    // Returns selected item

    debug(`Showing items of type ${type}`);

    let choices = [];
    this.inventory.forEach(item => {
      if (type && item.type != type)
      {
        debug(`${item.name} does not match type specified`);
      }
      else
      {
        let damage = '';
        if (item.type === 'weapon')
          damage = `\ndamage: ${item.damage}`;

        let modifiers = '';
        for (let stat in item.statModifiers)
        {
          if (item.statModifiers[stat] > 0)
            modifiers += `\n\t${stat}: ${item.statModifiers[stat]}`;
        }

        let choice = {
          name: `${item.name}${damage}${modifiers}`,
          value: item,
          paginated: true
        };
        choices.push(choice);
      }  
    }); 
    
    let itemSelected;
    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'item',
        message: 'Select item',
        choices: [
          ...choices,
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        itemSelected = answers.item;
        debug(`Item selected: ${itemSelected.name}`);
      });
    
    return itemSelected;
  }


  /*
    Choose skill points
  */
  async chooseStats()
  {
    let itemSelected;
    let choices = [];
    for (let stat in this.baseStats)
    {
      let choice = { name: `${stat} - ${this.baseStats[stat]}`, value: stat };
      
      if (this.skillPoints == 0)
        choice['disabled'] = 'not enough skill points'
      
      choices.push(choice);
    }

    clearScreen();
    message(`---------=---------\nStats\n---------=---------`);
    message(`skill points available: ${this.skillPoints}`);

    await inquirer
      .prompt([{ 
        type: 'list',
        name: 'item',
        message: 'Choose stat to upgrade',
        choices: [
          ...choices,
          {name: CANCEL},
        ] 
      }])
      .then(answers => {
        itemSelected = answers.item;
        debug(`Item selected: ${itemSelected.name}`);
      });
      
    if (itemSelected != CANCEL && this.skillPoints > 0)
    {
      this.skillPoints--;
      this.baseStats[itemSelected]++;

      await this.chooseStats();
    }
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
}