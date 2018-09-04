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
      head:       {item: null, type: 'head'},
      shoulders:  {item: null, type: 'shoulders'},
      hands:      {item: null, type: 'hands'},
      torso:      {item: null, type: 'torso'},
      legs:       {item: null, type: 'legs'},
      feet:       {item: null, type: 'feet'},
      leftHand:   {item: null, type: 'shield'},
      rightHand:  {item: null, type: 'weapon'},
      neck:       {item: null, type: 'necklace'},
      ring1:      {item: null, type: 'ring'},
      ring2:      {item: null, type: 'ring'},
      ring3:      {item: null, type: 'ring'},
      ring4:      {item: null, type: 'ring'},
    };
    this.inventory = [];

    this.strength = 5;
  }


  attackPower()
  {
    return this.strength + Math.random() * 2;
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
    message(`---------=---------\nStatus\n---------=---------`);
    message(`health: ${this.health}`);
    for (let stat in this.statusEffects)
    {
      if (this.statusEffects[stat]) message(stat);
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


  async changeEquipment()
  {
    clearScreen();
    message(`---------=---------\nEquipment\n---------=---------`);

    let choices = [];
    for (var slot in this.equipment) {
      let choice = {
        name: `${slot}: ${this.equipment[slot].item ? this.equipment[slot].item.name : 'empty'}`, 
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
      
    let item = await this.selectItem(this.equipment[slotSelected].type);
    
    // Swap item in equipment
    if (item != CANCEL)
    {
        debug(`Swapping ${item.name} ${item.itemID}.`);

        if (this.equipment[slotSelected].item) // Check slot isn't empty
        {
          this.inventory.push(this.equipment[slotSelected].item);  
        }
        this.equipment[slotSelected].item = item;
        this.removeItemFromInventory(item);
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
        let choice = {
          name: `${item.name}`,
          value: item,
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


  removeItemFromInventory(itemToRemove)
  {
    debug(`Removing: `);
    debug(itemToRemove);

    this.inventory = this.inventory.filter(item => item.itemID != itemToRemove.itemID);
  }


  static createRandomEnemy()
  {
    const names = ['Goblin', 'Slime', 'Bandit', 'Wolf'];
    const health = getRandomInt(20, 40);
    let enemy = new Character(getRandomChoice(names), health);
    return enemy;
  }
}