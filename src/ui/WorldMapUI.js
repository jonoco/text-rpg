import blessed from 'blessed';
import contrib from 'blessed-contrib';
import MiniMap from './MiniMap';
import dispatch from '../dispatch';

function WorldMapUI ()
{
  this.widget = blessed.box();

  const subWidth = 15;
  const subHeight = 15;
  const mapWidth = ((subWidth * 2) + 1);
  const mapHeight = (subHeight + 2);

  this.map = MiniMap({
    parent: this.widget,
    superWidth: 50,   // size of full map
    superHeight: 50,
    subWidth: subWidth,     // size of minimap
    subHeight: subHeight,
    seed: 0,          // randomization seed
    currentLocation: {x: 0, y: 0},  // starting location within map
    top: 0,
    left: 0,
    width: mapWidth,
    height: mapHeight,
    align: 'center',
    valign: 'middle',
    label: 'map',
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
    parent: this.widget,
    top: 0,
    left: mapWidth+1,
    width: 14,
    height: 10,
    label: 'map',
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

  this.log = contrib.log({ parent: this.widget
    , fg: "green"
    , label: 'WorldMap Log'      
    , right: 0
    , height: "100%"
    , width: "40%"
    , tags: true      
    , border: {type: "line", fg: "cyan"} });

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

  this.map.key('i', () => {
    if (this.widget.detached) return;

    dispatch.emit('inventory.open');
  });

  this.map.key('e', () => {
    if (this.widget.detached) return;

    dispatch.emit('equipment.open');
  });

  this.updateInfo(this.info, this.map);
}


// UNUSED
WorldMapUI.prototype.detach = function()
{
  this.widget.screen.remove(this.widget);
}


// UNSUED
WorldMapUI.prototype.attach = function(screen)
{
  screen.append(this.widget);
}


WorldMapUI.prototype.move = function(direction, minimap, info)
{
  if (this.widget.detached) return;

  minimap.moveLocation(direction);
  this.updateInfo(info, minimap);
  minimap.screen.render(); 

  dispatch.emit('move');
}


WorldMapUI.prototype.updateInfo = function(infoWidget, minimap) {
  let sector = minimap.getCurrentSector();
  let sectorInfo = `No info`;

  switch (sector)
  {
    case '#':
      sectorInfo = 'Empty field';
      break;
    case 'w':
      sectorInfo = 'Quiet river';
      break;
    default:
      sectorInfo = 'No info';
  }

  sectorInfo += `\n${minimap.currentLocation.x}:${minimap.currentLocation.y}`;

  infoWidget.setContent(sectorInfo);
};


export default WorldMapUI;