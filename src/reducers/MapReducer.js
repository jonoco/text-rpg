/**
 * map : ndarray
 * width : number
 * height : number
 * x : number
 * y : number
 */
const DefaultState = {
  map: null,
  width: 0,
  height: 0,
  x: 0,
  y: 0
};

export default function MapReducer(state = DefaultState, action) {
  const { payload, type } = action;

  switch(type) {
    case 'SET_MAP':
      return {
        ...state,
        map: payload.map,
        width: payload.width,
        height: payload.height
      }
    case 'MOVE':
      return move(state, payload);
    default:
      return state;
  }
}


const move = (state, payload) => {
  let { x, y } = state;

  switch (payload.direction)
  {
    case 'up':
      y--;
      y = y < 0 ? state.height - 1 : y; 
      break;
    case 'down':
      y++;
      y = y == state.height ? 0 : y; 
      break;
    case 'left':
      x--;
      x = x < 0 ? state.width - 1 : x; 
      break;
    case 'right':
      x++;
      x = x == state.width ? 0 : x; 
      break;
  }

  return {
    ...state,
    x,
    y
  }
}