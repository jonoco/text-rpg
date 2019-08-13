var blessed = require('blessed')
  , Node = blessed.Node
  , Text = blessed.Text
  ;
var seedrandom = require('seedrandom');

import { debug } from '../utility';
import { store } from '../main';
import { GameMap } from '../GameMap';


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

  this.updateMap();

  store.subscribe(this.updateMap.bind(this));
}


MiniMap.prototype.updateMap = function()
{
  const subMapMatrix = this.genSubMapMatrix();

  // Map formatted string content
  const mapContent = this.genMapContent(subMapMatrix);

  this.setContent(mapContent);
  this.screen.render();
}


/*
  Generate subset from super map
  superMap - map to generate subset from
*/
MiniMap.prototype.genSubMapMatrix = function(superMap)
{
  const { map, x, y } = store.getState().map

  let subMapMatrix = [];

  let xStart = x - Math.floor(this.subMapWidth/2);
  xStart = xStart < 0 ? this.superMapWidth + xStart : xStart;

  let yStart = y - Math.floor(this.subMapHeight/2);
  yStart = yStart < 0 ? this.superMapHeight + yStart : yStart;

  for (let i = 0; i < this.subMapHeight; i++)
  {
    for (let j = 0; j < this.subMapWidth; j++)
    {
      let xOffset = (xStart + j) % this.superMapWidth;
      let yOffset = (yStart + i) % this.superMapHeight;

      subMapMatrix.push(map[xOffset + (yOffset*this.superMapWidth)]);
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
  const defaultSymbol = '#';
  let mapContent = '';
  mapArray.forEach( (sec, index) => {
    
    // if last sector of row, add linebreak
    if (index % this.subMapWidth == 0 && index != 0)
    {
      mapContent += '\n';
    }

    let x = index % this.subMapWidth;
    let y = Math.floor(index / this.subMapHeight);

    const sectorInfo = GameMap.atlas.find(req => sec >= req.min && sec <= req.max);
    const symbol = sectorInfo ? sectorInfo.symbol : defaultSymbol;

    // highlight center of map -> should indicate player location for tracking map
    if (x == Math.floor(this.subMapWidth/2) && y == Math.floor(this.subMapHeight/2))
    {
      mapContent += `{#ffffff-fg}{blink}${symbol}{/}`;
    }
    else
    { 
      let tag = sectorInfo ? sectorInfo.tag : '{#dddddd-fg}';
      mapContent += `${tag}${symbol}`;
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
  Get current sector
*/
MiniMap.prototype.getCurrentSector = function()
{
  const { x, y, map, width } = store.getState().map;

  let index = x + (y * width);
  return map[index];
}


MiniMap.prototype.getCurrentSectorInfo = function()
{
  const sector = this.getCurrentSector();
  return GameMap.atlas.find(req => sector >= req.min && sector <= req.max);
}


MiniMap.prototype.__proto__ = Text.prototype;

MiniMap.prototype.type = 'minimap';

export default MiniMap;