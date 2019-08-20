/**
 * Switch battle control to next character
 * @return {object} Action
 */
export const nextTurn = (character) => {
  return {
    type: 'NEXT_TURN',
    payload: { character }
  }
}