import { createSelector } from 'reselect';

const playerSelector = state => state.player;
const enemySelector = state => state.enemy;
const characterSelector = (state, character) => state[character];


export const getCharacterEquippedItems = createSelector(
  characterSelector,
  (character) => {
    if (!character)
      throw new Error('getCharacterDefaultHealth | No character located for selector');
    
    return character.inventory.items.filter(item => (character.inventory[item.slot] === item.id));
  }
)


export const getCharacterDefaultHealth = createSelector(
  characterSelector,
  (character) => {
    if (!character)
      throw new Error('getCharacterDefaultHealth | No character located for selector');

    let health = character.character.defaultHealth;
    health += character.character.skills.constitution * 10;

    return health;
  }
)


export const getCharacterActiveAbilities = createSelector(
  characterSelector,
  getCharacterEquippedItems,
  (character, items) => {
    return character.character.abilities.filter(ability => {
      let skillRequirements = true, 
          abilityRequirements = true, 
          itemRequirements = true;

      ability.skillRequirements.forEach(req => {
        if (!Object.entries(character.character.skills).find(skill => skill[0] == req.name && skill[1] >= req.level))
          skillRequirements = false;
      });

      ability.abilityRequirements.forEach(req => {
        if (!character.character.abilities.find(ability => ability.name === req.name && ability.uses >= req.uses))
          abilityRequirements = false;
      });
      
      ability.itemRequirements.forEach(req => {
        if (!items.find(item => item.type === req.type))
          abilityRequirements = false;
      });

      return (skillRequirements && abilityRequirements && itemRequirements);
    })
  }
);
