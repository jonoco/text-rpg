/**
 * location : [int]
 * battleFrequency : float (0-1)
 */
const DefaultState = {
  location: null,
  battleFrequency: 0.05
};


export default function GameReducer(state = DefaultState, action) {
  
  const { type, payload } = action;

  switch (type) {
  case 'CHANGE_LOCATION':
    return {
      ...state,
      location: payload.location
    }
  default:
    return state;
  }
}