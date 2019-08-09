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


export const getCharacterDefaultHealth = createSelector(
  characterSelector,
  (character) => {
    let health = character.character.defaultHealth;
    
    const endurance = character.character.skills.find(skill => skill.name === 'Endurance');
    if (endurance)
      health += endurance.level * 10;

    const vitality = character.character.skills.find(skill => skill.name === 'Vitality');
    if (vitality)
      health += vitality.level * 15;

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
        if (!character.character.skills.find(skill => skill.name === req.name && skill.level >= req.level))
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
