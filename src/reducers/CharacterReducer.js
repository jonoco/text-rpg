import { createInventoryReducer } from './InventoryReducer';

/**
 * name: string
 * health : int
 * defaultHealth : int
 * inventory : InventoryReducer - combined inventory and equipment handling
 * skills : [Skill]
 * abilities ; [Ability]
 */


function CharacterReducer(state = DefaultState, action) {
  
  const { type, payload } = action;

  switch (type) {
  case DAMAGE_PLAYER:
    const player = state.player;
    player.hurt(payload.damage);
    
    return {
      ...state,
      location: payload.location
    }
  default:
    return state;
  }
}

function createCharacterReducer(characterName = '') {
  const DefaultState = {
    name: null
  , health: 0
  , defaultHealth: 0
  , inventory: createInventoryReducer(characterName)
  , skills: []
  , abilities: []
};

  return function reducer(state = DefaultState, action) {
    const { name } = action;
    if (name !== characterName) return state;

    switch (action.type) {
      case 'HURT':
        break;
      case 'HEAL':
        break;
      default:
        return state;
    }
  }
}

export const PlayerReducer = createCharacterReducer('player');
export const EnemyReducer = createCharacterReducer('enemy');