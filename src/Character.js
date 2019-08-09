import { getRandomInt, getRandomChoice, debug } from './utility';
import { emit, on } from './dispatch';
import { store } from './main';
import { receiveAbility, receiveSkill, receiveExperience, newCharacter } from './actions/characterActions';
import { receiveItem, equipItem } from './actions/inventoryActions';
import { Item } from './Item';
import { Strength, Endurance, Agility, Vitality } from './skills';
import { Bite, Bash, Slash, DoubleSlash } from './abilities';

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
        , experience: 25
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
        , experience: 20
      },
      {
          name: 'Idiot'
        , health: { min: 40, max: 60 }
        , skills: [
            new Strength()
          ]
        , abilities: [
            new Bash()
          ]
        , experience: 20
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
        , experience: 30
      }
    ]
  }


  static createPlayer()
  {
    store.dispatch(newCharacter('player', 'Inigio', 100));    

    store.dispatch(receiveAbility('player', new Bash()));
    store.dispatch(receiveAbility('player', new Bite()));
    store.dispatch(receiveAbility('player', new Slash()));
    store.dispatch(receiveAbility('player', new DoubleSlash()));

    store.dispatch(receiveSkill('player', new Strength()));
    store.dispatch(receiveSkill('player', new Endurance()));
    store.dispatch(receiveSkill('player', new Agility()));
    store.dispatch(receiveSkill('player', new Vitality()));

    // starting equipment
    for (let i = 0; i < 4; i++) {
      let item = Item.createRandomItem();
      store.dispatch(receiveItem('player', item));
      store.dispatch(equipItem('player', item));
    }
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

    store.dispatch(receiveExperience('enemy', enemy.experience));
  }

}