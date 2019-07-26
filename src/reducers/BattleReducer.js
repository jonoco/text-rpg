const DefaultState = {
  isPlayerTurn: null,
  turnCount: 0
};

export default BattleReducer(state = DefaultState, action) {
  switch(action.type) {
    case 'NEXT_TURN':
      return {
          ...state
        , isPlayerTurn: !state.isPlayerTurn
        , turnCount: state.turnCount++
      }
      break;
    default:
      return state;
  }
}