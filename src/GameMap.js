import getPixels from 'get-pixels';
import { debug } from './utility';
import { store } from './main';
import { emit, on } from './dispatch';

import { setMap, move } from './actions/mapActions';

export class GameMap 
{
  constructor(props) 
  {
    //
  }


  start()
  {
    //
  }


  async load()
  {
    const { map, width, height } = await this.generateMap();
    store.dispatch(setMap(map, width, height));

    on('move.try', this.move);
  }


  static get atlas()
  {
    return [
        { min: 0, max: 20, symbol: 'W', description: 'Deep water', tag: '{#2222ff-fg}' }
      , { min: 21, max: 30, symbol: 'w', description: 'Shallow water', tag: '{#4444ff-fg}' }
      , { min: 31, max: 33, symbol: 'm', description: 'Marsh', tag: '{#222222-fg}' }
      , { min: 34, max: 50, symbol: 'g', description: 'Grassland', tag: '{#EDDD8A-fg}' }
      , { min: 51, max: 70, symbol: 'o', description: 'Open field', tag: '{#ffb275-fg}' }
      , { min: 71, max: 90, symbol: 'f', description: 'Forest', tag: '{#22ff33-fg}' }
      , { min: 91, max: 100, symbol: 'F', description: 'Dark forest', tag: '{#008D1E-fg}' }
      , { min: 101, max: 149, symbol: 'h', description: 'Rolling hills', tag: '{#ffdf8a-fg}' }
      , { min: 150, max: 255, symbol: 'M', description: 'Tall mountain', tag: '{#eeeeee-fg}' }
    ]
  }


  generateMap()
  {
    return new Promise(resolve => {
      const url = '/Users/Odysseus/Design/Heightmaps/lassenhm-height-map-merged.png';
      
      getPixels(url, (err, pixels) => {
        if (err) {
          throw new Error("Bad map image path");
        }
        
        debug(`got pixels ${pixels.shape.slice()}`, 'map');

        let map = [];

        // let map = '';
        
        const image_width = pixels.shape[0];    // pixels.shape[0];
        const image_height = pixels.shape[1];   // pixels.shape[1];
        const xoffset = 0;
        const yoffset = 0;
        const width = 50;    // spliced size
        const height = 50;

        // pixels = pixels.step(4, 4);
        pixels = pixels.step(Math.floor(image_width/width), Math.floor(image_height/height))

        for (let i = xoffset ; i < width+xoffset ; i++) {
          for (let j = yoffset ; j < height+yoffset ; j++) {
            map.push(pixels.get(j,i,0));
          }
        }      
        // TODO
        // save the raw ndarray in redux, save a modfied ndarray, or save a 1D array?
        resolve({ map, width, height });
      });
    });
  }


  scaleNumberToHex(number)
  {
    return Math.floor(number / 16).toString(16);
  }


  /*
    Change location based on direction
  */
  move(params) 
  {
    const { direction } = params;

    // TOOD check adjacent sector for blocking before moving
    store.dispatch(move(direction));
    emit('move.finish');
  }


  /*
    Ask user to choose move direction
  */
  // async askDirection() 
  // {
  //   let cancel = false;

  //   await inquirer
  //     .prompt([{ 
  //       name: "direction", 
  //       message: "Which direction? (w,a,s,d,stop)\n",
  //       filter: function(val) { return val.toLowerCase(); } 
  //     }])
  //     .then(answers => {
  //       if (answers.direction == 'stop')
  //       {
  //         cancel = true;
  //       }
  //       else if (['w', 'a', 's', 'd'].includes(answers.direction)) 
  //       {
  //         return this.move(answers["direction"]);
  //       } 
  //       else 
  //       {
  //         return this.askDirection();
  //       }
  //     });

  //   return cancel;
  // }


  /*
    Returns coordinates
  */
  // getLocation()
  // {
  //   return this.location;
  // }


  /*
    Returns current environment object
  */
  // getEnvironment() 
  // {
  //   const index = (this.location.y * 10) + this.location.x;
  //   return this.environments[index];
  // }


  /*
    Create environments across the map
  */
  // createMap()
  // {
  //   let locations = [
  //       {description: "Empty field"},
  //       {description: "Rancid Swamp"},
  //       {description: "Dense forest"},
  //   ];

  //   for (var i = 0; i < this.width*this.height; i++) 
  //   {
  //     this.environments.push(locations[getRandomInt(0, locations.length)]);
  //   }
  // }
}