/**
 * Create new character - enemy or player
 * @param  {string} character   Character type - [player, enemy]
 * @param  {string} name        Displayed name of the character
 * @param  {number} health      Character default health
 * @return {object}             Action
 */
export const newCharacter = (character, name, health) => {
  return {
    type: 'NEW_CHARACTER',
    character,
    payload: { name, health }
  }
}


/**
 * Hurt a character
 * @param  {string} character Character type - [player, enemy]
 * @param  {number} damage    Damage amount
 * @return {object}           Action
 */
export const hurt = (character, damage) => {
  return {
    type: 'HURT',
    character,
    payload: { damage }
  }
}


export const heal = (character, heal) => {
  return {
    type: 'HEAL',
    character,
    payload: { heal }
  }
}


export const receiveAbility = (character, ability) => {
  return {
    type: 'RECEIVE_ABILITY',
    character,
    payload: { ability }
  }
}


export const receiveSkill = (character, skill) => {
  return {
    type: 'RECEIVE_SKILL',
    character,
    payload: { skill }
  }
}


export const useAbility = (character, ability) => {
  return {
    type: 'USE_ABILITY',
    character,
    payload: { ability }
  }
}


export const nextTurn = () => {
  return {
    type: 'NEXT_TURN'
  }
}