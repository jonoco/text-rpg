/**
 * Set the super map
 * @param  {array} map   Super map
 * @return {object}      Action
 */
export const setMap = (map, width, height) => {
  return {
    type: 'SET_MAP',
    payload: {
      map,
      width,
      height
    }
  }
}


/**
 * Change current location in map by a cardinal direction
 * @param  {string} direction Cardinal direction: ['up', 'down', 'left', 'right']
 * @return {object}           Action
 */
export const move = direction => {
  return {
    type: 'MOVE',
    payload: {
      direction
    }
  }
}