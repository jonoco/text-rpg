import blessed from 'blessed';
import contrib from 'blessed-contrib';
import MiniMap from './MiniMap';
import { emit, on } from '../dispatch';

export default class WorldMapUI extends blessed.box
{
  constructor(props)
  {
    super(props);
 
    const subWidth = 25;
    const subHeight = 25;
    const mapWidth = ((subWidth * 2) + 1);
    const mapHeight = (subHeight + 2);
    const infoWidth = 20;
    const logWidth = 30;

    this.map = MiniMap({
      parent: this,
      superWidth: 50,         // size of full map
      superHeight: 50,
      subWidth: subWidth,     // size of minimap
      subHeight: subHeight,
      seed: 0,                // randomization seed
      currentLocation: {x: 0, y: 0},  // starting location within map
      top: 0,
      left: 0,
      width: mapWidth,
      height: mapHeight,
      align: 'center',
      valign: 'middle',
      label: 'Map',
      content: 'no content',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        border: {
          fg: '#ffffff'
        },
        hover: {
          bg: '#222222'
        }
      }
    });

    this.info = blessed.text({
      parent: this,
      top: 0,
      left: this.map.width,
      width: infoWidth,
      height: 10,
      label: 'Location',
      content: '',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        border: {
          fg: '#ffffff'
        },
        hover: {
          bg: 'green'
        }
      }
    });

    this.log = contrib.log({ 
        parent: this
      , fg: "green"
      , label: 'Log'      
      , left: this.map.width + this.info.width
      , height: "100%"
      , width: logWidth
      , tags: true      
      , border: {type: "line", fg: "cyan"} 
    });

    // input hooks
    this.map.key('up', () => {
      this.move('up', this.map, this.info);
    });

    this.map.key('down', () => {
      this.move('down', this.map, this.info);
    });

    this.map.key('left', () => {
      this.move('left', this.map, this.info);
    });

    this.map.key('right', () => {
      this.move('right', this.map, this.info);
    });

    this.updateInfo(this.info, this.map);
  }

  move (direction, minimap, info)
  {
    if (this.detached) return;

    minimap.moveLocation(direction);
    this.updateInfo(info, minimap);
    minimap.screen.render(); 

    emit('move', { text: direction });
  }


  updateInfo (infoWidget, minimap)
  {
    let sector = minimap.getCurrentSector();
    let sectorInfo = this.getSectorInfo(sector);

    sectorInfo += `\n${minimap.currentLocation.x}:${minimap.currentLocation.y}`;

    infoWidget.setContent(sectorInfo);
  };


  getSectorInfo(sector)
  {
    switch (sector)
    {
      case '#':
        return 'Empty field';
      case 'w':
        return 'Quiet river';
      case '@':
        return 'Stinking bog';
      case 'X':
        return 'Burnt forest';
      default:
        return 'No info';
    }
  }

}
