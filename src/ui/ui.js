// UNUSED

let minimap = require('./MiniMap');
let blessed = require('blessed');

let screen = blessed.screen({
  smartCSR: true,
  log: 'mylog'
});

let map = minimap({
  superWidth: 30,   // size of full map
  superHeight: 30,
  subWidth: 11,     // size of minimap
  subHeight: 11,
  seed: 0,          // randomization seed
  currentLocation: {x: 0, y: 0},  // starting location within map
  top: 0,
  left: 0,
  width: ((11 * 2) + 1),
  height: (11 + 2),
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

screen.append(map);

// input hooks
map.key('up', () => {
  map.moveLocation('up');
});

map.key('down', () => {
  map.moveLocation('down');
});

map.key('left', () => {
  map.moveLocation('left');
});

map.key('right', () => {
  map.moveLocation('right');
});


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
map.focus();

screen.render();
