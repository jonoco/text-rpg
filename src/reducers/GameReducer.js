const DefaultState = {
  location: null
};


export default function GameReducer(state = DefaultState, action) {
  
  const { type, payload } = action;

  switch (type) {
  case CHANGE_LOCATION:
    return {
      ...state,
      location: payload.location
    }
  default:
    return state;
  }
}