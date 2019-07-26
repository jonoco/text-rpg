/**
 * isPlayerTurn : bool
 * turnCoun : int
 */
const DefaultState = {
  isPlayerTurn: null,
  turnCount: 0
};

export default function BattleReducer(state = DefaultState, action) {
  switch(action.type) {
    case 'NEXT_TURN':
      return {
          ...state
        , isPlayerTurn: !state.isPlayerTurn
        , turnCount: state.turnCount + 1
      }
      break;
    default:
      return state;
  }
}