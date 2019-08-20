/**
 * isPlayerTurn : bool
 * turnCoun : int
 */
const DefaultState = {
    isPlayerTurn: null
  , characterTurn: null  
  , turnCount: 0
};

export default function BattleReducer(state = DefaultState, action) {
  const { type, payload } = action;
  switch(type) {
    case 'NEXT_TURN':
      return {
          ...state
        , characterTurn: payload.character
        , turnCount: state.turnCount + 1
      }
    default:
      return state;
  }
}