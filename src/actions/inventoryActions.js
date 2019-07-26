export const receiveItem = (character, item) => {
  return {
    type: 'RECEIVE_ITEM',
    character,
    payload: { item }
  }
}