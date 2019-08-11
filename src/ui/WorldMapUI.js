import blessed from 'blessed';
import contrib from 'blessed-contrib';
import MiniMap from './MiniMap';
import { emit, on } from '../dispatch';
import { store } from '../main';

export default class WorldMapUI extends blessed.box
{
  constructor(props)
  {
    super(props);

    const map = store.getState().map;
 
    const subWidth = 25;
    const subHeight = 25;
    const mapWidth = ((subWidth * 2) + 1);
    const mapHeight = (subHeight + 2);
    const infoWidth = 20;
    const logWidth = 30;

    this.map = MiniMap({
      parent: this,
      superWidth: map.width,       // size of full map
      superHeight: map.height,
      subWidth: subWidth,     // size of minimap
      subHeight: subHeight,
      seed: 0,                // randomization seed
      currentLocation: {x: map.x, y: map.y},  // starting location within map
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
      emit('move.try', { direction: 'up' });
    });

    this.map.key('down', () => {
      emit('move.try', { direction: 'down' });
    });

    this.map.key('left', () => {
      emit('move.try', { direction: 'left' });
    });

    this.map.key('right', () => {
      emit('move.try', { direction: 'right' });
    });

    this.updateInfo();

    store.subscribe(this.updateInfo.bind(this));
  }


  updateInfo ()
  {
    const { x, y, map, width, height } = store.getState().map;

    let sectorInfo = this.map.getCurrentSectorInfo();
    let content = sectorInfo ? sectorInfo.description : 'Unknown area';
    content += `\n${x}:${y}`;

    this.info.setContent(content);
    this.screen.render();
  }
}
