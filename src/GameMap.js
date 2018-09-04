import inquirer from 'inquirer';
import { message, getRandomInt, clearScreen } from './utility';

export class GameMap {
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