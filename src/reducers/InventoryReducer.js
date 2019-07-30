import produce from 'immer';

/**
 * head: number - id of Item
 * chest: number
 * shoulders: number
 * legs: number
 * hands: number
 * left_hand: number
 * right_hand: number
 * items : [Item]
 */
const DefaultState = {
    head: null
  , shoulders: null
  , hands: null
  , torso: null
  , legs: null
  , feet: null
  , weapon: null
  , offhand: null
  , necklace: null
  , ring: null
  , items: []
}


export default function createInventoryReducer(characterType = '') {
  return function reducer(state = DefaultState, action) {
    const { character, payload, type } = action;
    if (characterType !== character) return state;

    switch (type) {
      case 'RECEIVE_ITEM':
        return {
            ...state
          , items: [ ...state.items, payload.item ]
        }
      case 'REMOVE_ITEM':
        break;
      case 'EQUIP_ITEM':
        return equip(state, payload);
      case 'UNEQUIP_ITEM':
        return unequip(state, payload);
      default:
        return state;
    }
  }
}


const equip = (state, payload) => {
  return {
    ...state,
    [payload.item.slot]: payload.item.id
  }
}


const unequip = (state, payload) => {
  return {
    ...state,
    [payload.slot]: null
  }
}
