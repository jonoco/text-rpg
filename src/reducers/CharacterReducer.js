import { combineReducers } from 'redux';
import createInventoryReducer from './InventoryReducer';

/**
 * name: string
 * health : int
 * defaultHealth : int
 * skills : [Skill]
 * abilities ; [Ability]
 * experience : int
 */
function createCharacterReducer(characterType = '') {
  const DefaultState = {
      name: null
    , health: 0
    , defaultHealth: 0
    , skills: []
    , abilities: []
    , experience: 0
  };

  // TODO
  // create character reducer, then combine with inventory reducer slice
  
  return function reducer(state = DefaultState, action) {
    const { character, payload, type } = action;
    if (character !== characterType) return state;

    switch (type) {
      case 'NEW_CHARACTER':
        return {
            ...state
          , name: payload.name
          , health: payload.health
          , defaultHealth: payload.health
          , skills: []
          , abilities: []
        }
      case 'HURT':
        return hurt(state, payload);
      case 'HEAL':
        return heal(state, payload);
      case 'RECEIVE_ABILITY':
        return {
            ...state
          , abilities: [...state.abilities, payload.ability]
        }
      case 'RECEIVE_SKILL':
        return {
            ...state
          , skills: [...state.skills, payload.skill]
        }
      default:
        return state;
    }
  }
}


const hurt = (state, payload) =>
{
  let health = state.health - payload.damage;
  health = health < 0 ? 0 : health;

  return {
      ...state
    , health
  }
}


const heal = (state, payload) =>
{
  let health = state.health + payload.heal;
  health = health > state.defaultHealth ? state.defaultHealth : health;

  return {
      ...state
    , health
  }
}

export const player = combineReducers({
  character: createCharacterReducer('player'),
  inventory: createInventoryReducer('player')
});

export const enemy = combineReducers({
  character: createCharacterReducer('enemy'),
  inventory: createInventoryReducer('enemy')
});