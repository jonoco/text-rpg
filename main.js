var inquirer = require('inquirer');

// Constants


const _DEBUG_ = true;
const CANCEL = 'Cancel';


// Utility functions

/*
  Returns random int from [min, max)
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}


/*
  Returns random choice from array
*/
function getRandomChoice(array) {
  return array[getRandomInt(0, array.length)];
}

/*
  Prints message if debug flag is on
*/
function debug(text) {
  if (_DEBUG_) console.dir(text);
}

/*
  Prints formatted console message
*/
function message(text) {
  console.log(text);
}

/*
  Clear terminal
*/
function clearScreen() {
  console.log('\x1Bc'); // Clear Terminal
}


// Types


const ItemType = { head: 0, shoulders: 1, hands: 2, torso: 3, legs: 4, 
      feet: 5, weapon: 6, shield: 7, necklace: 8, ring: 9 };


// Classes


class GameMap {
  constructor() 
  {
    this.location = { x: 0, y: 0 };
    this.environments = [];
    this.width = 10;
    this.height = 10;

    this.createMap();
  }


  /*
    Change location based on direction
  */
  move(direction) 
  {
    switch (direction) {
      case 'w':
        this.location.y++;
        this.location.y = this.location.y > this.height-1 ? 0 : this.location.y % this.height;
        break;
      case 's':
        this.location.y--;
        this.location.y = this.location.y < 0 ? this.height-1 : this.location.y % this.height;
        break;
      case 'd':
        this.location.x++;
        this.location.x = this.location.x > this.width-1 ? 0 : this.location.x % this.width;
        break;
      case 'a':
        this.location.x--;
        this.location.x = this.location.x < 0 ? this.width-1 : this.location.x % this.width;
        break;
    }
    clearScreen();
    message(
      `You're at (${this.location.x} : ${this.location.y})\n${this.getEnvironment().description}`
    );
  }


  /*
    Ask user to choose move direction
  */
  async askDirection() 
  {
    let cancel = false;

    await inquirer
      .prompt([{ 
        name: "direction", 
        message: "Which direction? (w,a,s,d,stop)\n",
        filter: function(val) { return val.toLowerCase(); } 
      }])
      .then(answers => {
        if (answers.direction == 'stop')
        {
          cancel = true;
        }
        else if (['w', 'a', 's', 'd'].includes(answers.direction)) 
        {
          return this.move(answers["direction"]);
        } 
        else 
        {
          return this.askDirection();
        }
      });

    return cancel;
  }


  /*
    Returns coordinates
  */
  getLocation()
  {
    return this.location;
  }


  /*
    Returns current environment object
  */
  getEnvironment() 
  {
    const index = (this.location.y * 10) + this.location.x;
    return this.environments[index];
  }


  /*
    Create environments across the map
  */
  createMap()
  {
    let locations = [
        {description: "Empty field"},
        {description: "Rancid Swamp"},
        {description: "Dense forest"},
    ];

    for (var i = 0; i < this.width*this.height; i++) 
    {
      this.environments.push(locations[getRandomInt(0, locations.length)]);
    }
  }
}


class Event {
  constructor(name)
  {
    this.name = name;
  }
}


class Item {
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


class Character {
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


class Battle {
  constructor(player)
  {
    this.battleOver = false;
    this.victory = false;

    this.enemy = Character.createRandomEnemy();
    this.player = player;
  }


  async start()
  {
    clearScreen();
    message(`---------=---------\nBattle!\n---------=---------`);

    while (!this.battleOver)
    {      
      message(`Fighting a ${this.enemy.name}.`);
      message(`${this.enemy.name} health: ${this.enemy.health}`);
      message(`${this.player.name} health: ${this.player.health}`);

      await this.askAttackChoice();  
    }
  }


  attackEnemy(choice)
  {
    // choice is unused

    message(`Attacking ${this.enemy.name}.`);

    this.enemy.hit(this.player.attackPower());

    if (!this.enemy.isAlive())
    {
      message(`${this.enemy.name} was killed.`);
      this.battleOver = true;
      this.victory = true;
    }
    else
    {
      this.attackPlayer();
    }
  }

  
  attackPlayer()
  {
    message(`${this.enemy.name} is attacking.`);

    this.player.hit(this.enemy.attackPower());

    if (!this.player.isAlive())
    {
      message(`You were killed by a ${this.enemy.name}`);
      this.battleOver = true;
    }
  }


  async askAttackChoice()
  {
    await inquirer
      .prompt([
        { name: "attack", message: "Choose your attack? (1,2)\n" }
      ])
      .then(answers => {
        if (['1','2'].includes(answers.attack)) 
        {
          clearScreen();
          return this.attackEnemy(answers["attack"]);
        } 
        else 
        {
          return this.askAttackChoice();
        }
      });
  }
}


class Game {
  constructor() 
  {
    this.map = new GameMap();
    this.player = new Character(`Player`, 100);

    this.battleFrequency = 0.2; // probability to start a fight
    this.gameOver = false;
  }  

  
  /*
    Allow player to move, possibly encountering battles
  */
  async move()
  {
    while (true)
    {
      let cancel = await this.map.askDirection();
    
      if (cancel) break;

      if (this.checkStartFight())
      {
        const battle = new Battle(this.player);
        await battle.start();

        clearScreen();

        if (battle.victory)
        {
          message(`You beat the ${battle.enemy.name}!`);
          this.player.receiveItem(Item.createRandomItem());
        }
        else
        {
          message(`You lost, fool!`);
          this.gameOver = true;
        }
        break;
      }
    }
  }


  /*
    Main game loop and entry point
  */
  async start()
  {
    const intro = `You wake up in a graveyard.`;
    message(intro);

    while(!this.gameOver)
    {
      clearScreen();
      message(`You're at (${this.map.getLocation().x}, ${this.map.getLocation().y})`);
      message(`${this.map.getEnvironment().description}`);

      let choice;
      await inquirer
      .prompt([{ 
        type: 'list',
        name: 'choice',
        message: 'What do you want to do?',
        choices: [
          {name: 'Move'},
          {name: 'Rest'},
          {name: 'Check inventory', value: 'inventory'},
          {name: 'Change equipment', value: 'equipment'},
          {name: 'Check status', value: 'status'},
        ] 
      }])
      .then(answers => {
        choice = answers.choice;
      });

      switch (choice)
      {
        case 'Move':
          await this.move();
          break;
        case 'Rest':
          this.rest();
          break;
        case 'inventory':
          await this.player.checkInventory();
          break;
        case 'equipment':
          await this.player.changeEquipment();
          break;
        case 'status':
          await this.player.checkStatus();
          break;
      }
    }
  }


  /*
    Let player regenerate health, risking battle
  */
  rest() 
  {
    debug (`Healing for ${this.player.defaultHealth}`);

    this.player.heal(this.player.defaultHealth);

    message(`Health recovered. (${this.player.health})`);
  }


  /*
    Determine whether a battle should occur
  */
  checkStartFight()
  {
    const shouldStartFight = Math.random() < this.battleFrequency;

    debug(`Start a fight? ${shouldStartFight}`);

    return shouldStartFight;
  }
}


const main = () => {
  clearScreen();

  var game = new Game();
  game.start();
};


main();
