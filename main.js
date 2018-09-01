var inquirer = require('inquirer');

// Constants


const _DEBUG_ = false;


// Utility functions


function getRandomInt(min, max) {
  //The maximum is exclusive and the minimum is inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}


function debug(text) {
  if (_DEBUG_) console.log(text);
}


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
    this.locations = [];
    this.width = 10;
    this.height = 10;

    this.createMap();
  }


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
    console.log(
      `You're at (${this.location.x} : ${this.location.y})\n${this.getLocation().description}`
    );
  }


  async askDirection() 
  {
    await inquirer
      .prompt([
        { name: "direction", message: "Which direction? (w,a,s,d)\n" }
      ])
      .then(answers => {
        if (['w', 'a', 's', 'd'].includes(answers.direction)) {
          return this.move(answers["direction"]);
        } else {
          return this.askDirection();
        }
      });
  }


  getLocation() 
  {
    const index = (this.location.y * 10) + this.location.x;
    return this.locations[index];
  }


  createMap()
  {
    let locations = [
        {description: "Empty field"},
        {description: "Rancid Swamp"},
        {description: "Dense forest"},
    ];

    for (var i = 0; i < this.width*this.height; i++) 
    {
      this.locations.push(locations[getRandomInt(0, locations.length)]);
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
    this.itemType = null;
  }


  static isValidItemType(type)
  {
    return ItemType.includes(type);
  }
}


class Character {
  constructor(name, defaultHealth)
  {
    this.name = name;
    this.defautlHealth = defaultHealth;
    this.health = defaultHealth;
    this.equipment = {
      head: null,
      shoulders: null,
      hands: null,
      torso: null,
      legs: null,
      feet: null,
      leftHand: null,
      rightHand: null,
      neck: null,
      ring1: null,
      ring2: null,
      ring3: null,
      ring4: null,
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
    console.log(`${this.name} was hit for ${damage}`);

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
}


class Battle {
  constructor(player)
  {
    this.battleOver = false;
    this.victory = false;

    this.enemy = new Character("Goblin", 20);
    this.player = player;
  }


  async start()
  {
    clearScreen();

    while (!this.battleOver)
    {
      console.log(`---------=---------\nBattle!\n---------=---------`);
      
      console.log(`${this.enemy.name} is attacking.`);
      console.log(`${this.enemy.name} health: ${this.enemy.health}`);
      console.log(`${this.player.name} health: ${this.player.health}`);

      await this.askAttackChoice();  
    }
  }


  attackEnemy(choice)
  {
    // choice is unused

    console.log(`Attacking ${this.enemy.name}.`);

    this.enemy.hit(this.player.attackPower());

    if (!this.enemy.isAlive())
    {
      console.log(`${this.enemy.name} was killed.`);
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
    console.log(`${this.enemy.name} is attacking.`);

    this.player.hit(this.enemy.attackPower());

    if (!this.player.isAlive())
    {
      console.log(`You were killed by a ${this.enemy.name}`);
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


  async start()
  {
    const intro = `You wake up in a graveyard.`;
    console.log(intro);

    while(!this.gameOver)
    {
      await this.map.askDirection();
      
      if (this.checkStartFight())
      {
        const battle = new Battle(this.player);
        await battle.start();

        clearScreen();

        if (battle.victory)
        {
          console.log(`You beat the ${battle.enemy.name}!`);
        }
        else
        {
          console.log(`You lost, fool!`);
          this.gameOver = true;
        }
      }
    }
  }


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
