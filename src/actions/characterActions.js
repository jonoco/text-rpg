/**
 * Create new character - enemy or player
 * @param  {string} character   Character type - [player, enemy]
 * @param  {string} name        Displayed name of the character
 * @param  {number} health      Character default health
 * @return {object}             Action
 */
export const newCharacter = (character, name, health, playable) => {
  return {
    type: 'NEW_CHARACTER',
    character,
    payload: { name, health, playable }
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

/**
 * Heal a character
 * @param  {string} character Character type - [player, enemy]
 * @param  {number} heal      Amount to heal
 * @param  {number} maxHeal   Maximum amount to heal, i.e. default health
 * @return {object}           Action
 */
export const heal = (character, heal, maxHeal) => {
  return {
    type: 'HEAL',
    character,
    payload: { heal, maxHeal }
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


export const receiveEffect = (character, effect) => {
  return {
    type: 'RECEIVE_EFFECT',
    character,
    payload: { effect }
  }
}


export const incrementEffect = (character, effect) => {
  return {
    type: 'INCR_EFFECT',
    character,
    payload: { effect }
  } 
}


export const removeEffect = (character, effect) => {
  return {
    type: 'REMOVE_EFFECT',
    character,
    payload: { effect }
  }
}


export const clearExpiredEffects = character => {
  return {
    type: 'EXPIRED_EFFECTS',
    character
  }
}


export const useAbility = (character, ability) => {
  return {
    type: 'USE_ABILITY',
    character,
    payload: { ability }
  }
}


export const receiveExperience = (character, experience) => {
  return {
    type: 'RECEIVE_EXPERIENCE',
    character,
    payload: { experience }
  }
}


export const levelupSkill = (character, skill) => {
  return {
    type: 'LEVELUP_SKILL',
    character,
    payload: { skill }
  }
}
