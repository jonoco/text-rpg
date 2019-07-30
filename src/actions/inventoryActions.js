export const receiveItem = (character, item) => {
  return {
    type: 'RECEIVE_ITEM',
    character,
    payload: { item }
  }
}

export const equipItem = (character, item) => {
  return {
    type: 'EQUIP_ITEM',
    character,
    payload: { item }
  }
}