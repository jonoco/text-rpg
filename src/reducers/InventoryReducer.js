/**
 * head: Item
 * chest: Item
 * shoulders: Item
 * legs: Item
 * hands: Item
 * left_hand: Item
 * right_hand: Item
 * inventory : [Item]
 */
const DefaultState = {
    head: null
  , chest: null
  , shoulders: null
  , legs: null
  , hands: null
  , left_hand: null
  , right_hand: null
  , inventory: []
}


export default function createInventoryReducer(characterType = '') {
  return function reducer(state = DefaultState, action) {
    const { character, payload, type } = action;
    if (characterType !== character) return state;

    switch (type) {
      case 'RECEIVE_ITEM':
        return {
            ...state
          , inventory: [ ...state.inventory, payload.item ]
        }
      case 'REMOVE_ITEM':
        break;
      case 'EQUIP':
        break;
      case 'UNEQUIP':
        break;
      default:
        return state;
    }
  }
}
