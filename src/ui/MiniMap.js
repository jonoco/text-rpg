var blessed = require('blessed')
  , Node = blessed.Node
  , Text = blessed.Text
  ;
var seedrandom = require('seedrandom');

function MiniMap(options)
{
  if (!(this instanceof Node)) {
    return new MiniMap(options);
  }

  options = options || {};
    
  this.options = options;
  Text.call(this, options);

  // Full map size
  this.superMapWidth = options.superWidth;
  this.superMapHeight = options.superHeight;

  // Visible Map size
  this.subMapWidth = options.subWidth;
  this.subMapHeight = options.subHeight;

  // Central location
  this.currentLocation = options.currentLocation;

  // Number of map sectors
  this.size = options.superWidth * options.superHeight;

  // Map seed
  this.seed = options.seed;

  // Full map array
  this.superMapMatrix = this.genSuperMapMatrix(this.size, options.seed);

  // Subset of full map
  this.subMapMatrix = this.genSubMapMatrix(this.superMapMatrix);

  // Map formatted string content
  this.mapContent = this.genMapContent(this.subMapMatrix);

  this.setContent(this.mapContent);
}



/* 
  Generate a new super map
  size - size of map
  seed - seed for map generation
*/
MiniMap.prototype.genSuperMapMatrix = function(size = 900, seed = 0)
{
  let superMap = [];
  var rng = seedrandom(seed); // seeded random number generator
  
  for (let i = 0; i < size; i++)
  {
    let random = rng();
    let sector = '#';
    if (random > 0.9)
      sector = 'w';
    else if (random > 0.8)
      sector = 'X';
    else if (random > 0.75)
      sector = '@';

    superMap.push(sector);
  }

  return superMap;
}


/*
  Generate subset from super map
  superMap - map to generate subset from
*/
MiniMap.prototype.genSubMapMatrix = function(superMap)
{
  let subMapMatrix = [];

  let xStart = this.currentLocation.x - Math.floor(this.subMapWidth/2);
  xStart = xStart < 0 ? this.superMapWidth + xStart : xStart;

  let yStart = this.currentLocation.y - Math.floor(this.subMapHeight/2);
  yStart = yStart < 0 ? this.superMapHeight + yStart : yStart;

  let locationCoord = `location (${this.currentLocation.x} : ${this.currentLocation.y})`;
  let mapCoord = `map (${xStart} : ${yStart})`;

  for (var y = 0; y < this.subMapHeight; y++)
  {
    for (var x = 0; x < this.subMapWidth; x++)
    {
      let xOffset = (xStart + x) % this.superMapWidth;
      let yOffset = (yStart + y) % this.superMapHeight;

      subMapMatrix.push(superMap[xOffset + (yOffset*this.superMapWidth)]);
    }
  }

  return subMapMatrix
}


/*
  Generate map widget content: a formatted string
  mapArray - map to generate string for
*/
MiniMap.prototype.genMapContent = function(mapArray)
{
  let mapContent = '';
  mapArray.forEach( (sec, index) => {
    
    // if last sector of row, add linebreak
    if (index % this.subMapWidth == 0 && index != 0)
    {
      mapContent += '\n';
    }

    let x = index % this.subMapWidth;
    let y = Math.floor(index / this.subMapHeight);

    // highlight current location
    // if (currentLocation.x == x && currentLocation.y == y)

    // highlight center of map -> should indicate player location for tracking map
    if (x == Math.floor(this.subMapWidth/2) && y == Math.floor(this.subMapHeight/2))
    {
      mapContent += `{#ffffff-fg}{blink}${sec}{/}`;
    }
    else
    {
      let tag = '';
      switch (sec)
      {
        case '#':
          tag = '{#88ff66-fg}';
          break;
        case 'w':
          tag = '{#0000ff-fg}';
          break;
        default:
          tag = '{#dddddd-fg}';

      }
      mapContent += `${tag}${sec}`;
    }

    // add space after each sector but not end of rows
    if (index % this.subMapWidth != this.subMapWidth-1 && index != mapArray.length-1)
    {
      mapContent += ' ';
    }
  });
  return mapContent;
}


/*
  Move the current location and update map
  direction - direction of movement
*/
MiniMap.prototype.moveLocation = function(direction)
{
  switch (direction)
  {
    case 'up':
      this.currentLocation.y--;
      this.currentLocation.y = this.currentLocation.y < 0 ? this.superMapHeight-1 : this.currentLocation.y; 
      break;
    case 'down':
      this.currentLocation.y++;
      this.currentLocation.y = this.currentLocation.y == this.superMapHeight ? 0 : this.currentLocation.y; 
      break;
    case 'left':
      this.currentLocation.x--;
      this.currentLocation.x = this.currentLocation.x < 0 ? this.superMapWidth-1 : this.currentLocation.x; 
      break;
    case 'right':
      this.currentLocation.x++;
      this.currentLocation.x = this.currentLocation.x == this.superMapWidth ? 0 : this.currentLocation.x; 
      break;
  }

  // generate new sub map from super map
  this.subMapMatrix = this.genSubMapMatrix(this.superMapMatrix);

  // convert map to string
  this.mapContent = this.genMapContent(this.subMapMatrix);

  // update map ui
  this.setContent(this.mapContent);

  this.screen.render();
}


/*
  Get sector information from a cardinal direction
  direction - cardinal direction to check
*/
MiniMap.prototype.getAdjacentSector = function(direction)
{
  let adjacentLocation = this.currentLocation;

  switch (direction)
  {
    case 'up':
      adjacentLocation.y++;
      adjacentLocation.y = adjacentLocation.y == this.superMapHeight ? 0 : adjacentLocation.y; 
      break;
    case 'down':
      adjacentLocation.y--;
      adjacentLocation.y = adjacentLocation.y < 0 ? this.superMapHeight-1 : adjacentLocation.y;
      break;
    case 'left':
      adjacentLocation.x--;
      adjacentLocation.x = adjacentLocation.x < 0 ? this.superMapWidth-1 : adjacentLocation.x; 
      break;
    case 'right':
      adjacentLocation.x++;
      adjacentLocation.x = adjacentLocation.x == this.superMapWidth ? 0 : adjacentLocation.x; 
      break;
  }

  let index = adjacentLocation.x + (adjacentLocation.y * this.superMapWidth);
  return this.superMapMatrix[index];
}

/*
  Get current sector
*/
MiniMap.prototype.getCurrentSector = function()
{
  let index = this.currentLocation.x + (this.currentLocation.y * this.superMapWidth);
  return this.superMapMatrix[index];
}


MiniMap.prototype.__proto__ = Text.prototype;

MiniMap.prototype.type = 'minimap';

export default MiniMap;