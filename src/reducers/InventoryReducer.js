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

function InventoryReducer(state, action) {
  switch(action.type) {
    case 'RECEIVE_ITEM':
      break;
    case 'REMOVE_ITEM':
      break;
    case 'EQUIP':
      break;
    case 'UNEQUIP':
      break;
    default:
  }
}

export default function createInventoryReducer(characterName = '') {
  return function reducer(state = DefaultState, action) {
    const { name } = action;
    if (characterName !== name) return state;

    switch (action.type) {
      case 'RECEIVE_ITEM':
        break;
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
