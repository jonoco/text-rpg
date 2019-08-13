import { createSelector } from 'reselect';
import { GameMap } from '../GameMap';


export const getCurrentSector = (state) => {
  const { x, y, map, width } = state.map;
  const index = x + (y * width);
  return map[index];
}


/**
  Get sector information from a cardinal direction
  direction - cardinal direction to check
*/
export const getAdjacentSector = (state, direction) => {
  let { x, y, map, width, height } = state.map;

  switch (direction)
  {
    case 'down':
      y++;
      y = y == height ? 0 : y; 
      break;
    case 'up':
      y--;
      y = y < 0 ? height - 1 : y;
      break;
    case 'left':
      x--;
      x = x < 0 ? width - 1 : x; 
      break;
    case 'right':
      x++;
      x = x == width ? 0 : x; 
      break;
    default:
      throw new Error(`mapSelectors: Invalid direction: ${direction}`);
  }

  const index = x + (y * width);
  return map[index];   
}
 

export const getCurrentSectorInfo = createSelector(
  getCurrentSector,
  (sector) => GameMap.atlas.find(req => sector >= req.min && sector <= req.max)
);


export const getAdjacentSectorInfo = createSelector(
  getAdjacentSector,
  (sector) => GameMap.atlas.find(req => sector >= req.min && sector <= req.max)
);

  
