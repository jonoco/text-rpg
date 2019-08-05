import { createSelector } from 'reselect';

const playerSelector = state => state.player;
const enemySelector = state => state.enemy;
const characterSelector = (state, character) => state[character];


export const getCharacterEquippedItems = createSelector(
  characterSelector,
  (character) => {
    return character.inventory.items.filter(item => (character.inventory[item.slot] === item.id));
  }
)
