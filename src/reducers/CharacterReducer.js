import { combineReducers } from 'redux';
import createInventoryReducer from './InventoryReducer';
import { getCharacterDefaultHealth } from '../selectors';
import { store } from '../main';


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
      character: null
    , name: null
    , health: 0
    , defaultHealth: 0
    , skills: []
    , abilities: []
    , experience: 0
    , totalExperience: 0
    , effects: []
    , playable: false
  };

  
  return function reducer(state = DefaultState, action) {
    const { character, payload, type } = action;
    if (character !== characterType) return state;

    switch (type) {
      case 'NEW_CHARACTER':
        return {
            ...DefaultState
          , character
          , name: payload.name
          , health: payload.health
          , defaultHealth: payload.health
          , playable: payload.playable
        }
      case 'HURT':
        return hurt(state, action);
      case 'HEAL':
        return heal(state, action);
      case 'RECEIVE_EXPERIENCE':
        return {
          ...state
         , experience: state.experience + payload.experience
         , totalExperience: state.totalExperience + payload.experience
        }
      case 'RECEIVE_ABILITY':
        // Ignore duplicate ability
        if (state.abilities.find(ability => {ability.name === payload.ability.name}))
          return state;

        return {
            ...state
          , abilities: [...state.abilities, payload.ability]
        }
      case 'RECEIVE_SKILL':
        // Ignore duplicate skill
        if (state.skills.find(skill => {skill.name === payload.skill.name}))
          return state;

        return {
            ...state
          , skills: [...state.skills, payload.skill]
        }
      case 'RECEIVE_EFFECT':
        // renew duplicate effect
        if (state.effects.find(effect => {effect.name === payload.effect.name}))
          return {
              ...state
            , effects: effects.map(effects => {
                if (effect.name === payload.effect.name) 
                  effect.count = 0;
              })
          };

        return {
            ...state
          , effects: [...state.effects, payload.effect]
        }
      case 'INCR_EFFECT':
        return {
          ...state,
          effects: state.effects.map(effect => {
            if (effect.name === payload.effect.name) {
              effect.count += 1;
            }

            return effect;
          })
        }
      case 'REMOVE_EFFECT':
        return {
          ...state,
          effects: state.effects.filter(effect => effect.name !== payload.effect.name)
        }
      case 'EXPIRED_EFFECTS':
        return {
          ...state,
          effects: state.effects.filter(effect => effect.count < effect.turns)
        }
      case 'USE_ABILITY':
        return {
          ...state,
          abilities: state.abilities.map(ability => {
            if (ability.name === payload.ability.name)
              ability.uses += 1;

            return ability;
          })
        }
      case 'LEVELUP_SKILL':
        if (payload.skill.requiredExperience() > state.experience)
          return state;

        return {
          ...state,
          experience: state.experience - payload.skill.requiredExperience(),
          skills: state.skills.map(skill => {
            if (skill.name === payload.skill.name) 
              skill.level += 1;
            return skill;
          })
        }
      default:
        return state;
    }
  }
}


const hurt = (state, action) =>
{
  const { payload } = action;

  let health = state.health - payload.damage;
  health = health < 0 ? 0 : health;

  return {
      ...state
    , health
  }
}


const heal = (state, action) =>
{
  const { payload } = action;

  let health = state.health + payload.heal;
  let defaultHealth = payload.maxHeal;
  
  health = health > defaultHealth ? defaultHealth : health;

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