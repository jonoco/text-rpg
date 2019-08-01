import { getRandomInt, getRandomChoice, debug } from './utility';
import { emit, on } from './dispatch';
import { store } from './main';
import { receiveAbility, receiveSkill, newCharacter } from './actions/actions';

import { Strength } from './skills';
import { Bite, Bash } from './abilities';

export class Character {
  static get enemyList()
  {
    return [
      {
          name: 'Goblin'
        , health: { min: 30, max: 80 }
        , skills: [
            new Strength()
          ]
        , abilities: [
            new Bash()
          , new Bite()
          ]
      },
      {
          name: 'Slime'
        , health: { min: 20, max: 70 }
        , skills: [
            new Strength()
          ]
        , abilities: [
            new Bash()
          ]
      },
      {
          name: 'Rogue'
        , health: { min: 40, max: 60 }
        , skills: [
            new Strength()
          ]
        , abilities: [
            new Bash()
          ]
      },
      {
          name: 'Wolf'
        , health: { min: 30, max: 70 }
        , skills: [
            new Strength()
          ]
        , abilities: [
            new Bite()
          ]
      }
    ]
  }
  /*
    Create a random character
  */
  static createRandomEnemy()
  {
    const enemy = getRandomChoice(Character.enemyList);
    store.dispatch(newCharacter(
        'enemy'
      , enemy.name
      , getRandomInt(enemy.health.min, enemy.health.max)
    ));

    enemy.skills.forEach(s => {
      store.dispatch(receiveSkill('enemy', s));
    });

    enemy.abilities.forEach(a => {
      store.dispatch(receiveAbility('enemy', a));
    });
  }

}