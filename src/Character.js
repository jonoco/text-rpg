import { getRandomInt, getRandomChoice, debug } from './utility';
import { emit, on } from './dispatch';
import { store } from './main';
import { receiveAbility, receiveSkill, receiveExperience, newCharacter, receiveEffect } from './actions/characterActions';
import { receiveItem, equipItem } from './actions/inventoryActions';
import { Item } from './Item';
import { GameMap } from './GameMap';
import { Strength, Endurance, Agility, Vitality } from './skills';
import { Bite, Bash, Slash, DoubleSlash, Slap, Heal } from './abilities';
import { Stunned } from './effects';

export class Character {
  static get enemyList()
  {
    return [
      {
          name: 'Goblin'
        , description: 'Often mistaken for an ugly Hobbit, loves to make spookey noises.'
        , health: { min: 30, max: 80 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
            new Bash()
          , new Bite()
          ]
        , experience: 25
        , environments: [ 
              GameMap.environments.forest
            , GameMap.environments.hill
            , GameMap.environments.grass
          ]
      },
      {
          name: 'Slime'
        , description: 'Experiment of the wizards of Niqlodean, attacks by falling from the sky.'
        , health: { min: 20, max: 60 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
            new Bash()
          ]
        , experience: 20
        , environments: [ 
              GameMap.environments.marsh
          ]
      },
      {
          name: 'Idiot'
        , description: 'Frequently dizzy and stupid, wanders in violent confusion.'
        , health: { min: 40, max: 60 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
            new Bash()
          ]
        , experience: 20
        , environments: [ 
              GameMap.environments.forest
            , GameMap.environments.hill
            , GameMap.environments.marsh 
          ]
      },
      {
          name: 'Wolf'
        , description: 'A grotesquely mishapen rabbit, coincedentally identical to a wolf.'
        , health: { min: 30, max: 60 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
            new Bite()
          ]
        , experience: 30
        , environments: [ 
              GameMap.environments.forest
            , GameMap.environments.hill
            , GameMap.environments.grass 
          ]
      },
      {
          name: 'Violent Fish'
        , description: 'A salmon with nothing to lose, fiercely determined to slap.'
        , health: { min: 50, max: 90 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
            new Slap()
          ]
        , experience: 30
        , environments: [ 
            GameMap.environments.water
          ]
      },
      {
          name: 'Witch'
        , description: 'Crazy broom wielding salesperson.'
        , health: { min: 60, max: 100 }
        , skills: {
            strength: getRandomInt(3, 6)
          , constitution: getRandomInt(3, 6)
          , dexterity: getRandomInt(3, 6)
          , intelligence: getRandomInt(3, 6)
          , wisdom: getRandomInt(3, 6)
          , charisma: getRandomInt(3, 6)
        }
        , abilities: [
              new Slap()
            , new Heal()
          ]
        , experience: 100
        , environments: [ 
              GameMap.environments.marsh
            , GameMap.environments.forest
          ]
      }

    ]
  }


  static createPlayer()
  {
    store.dispatch(newCharacter(
      'player', 
      'Inigio', 
      100, 
      true,
      {
          strength: getRandomInt(3, 6)
        , constitution: getRandomInt(3, 6)
        , dexterity: getRandomInt(3, 6)
        , intelligence: getRandomInt(3, 6)
        , wisdom: getRandomInt(3, 6)
        , charisma: getRandomInt(3, 6)
      }));    

    store.dispatch(receiveAbility('player', new Bash()));
    store.dispatch(receiveAbility('player', new Bite()));
    store.dispatch(receiveAbility('player', new Slash()));
    store.dispatch(receiveAbility('player', new DoubleSlash()));
    store.dispatch(receiveAbility('player', new Heal()));

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
  static createRandomEnemy(params)
  {
    const { environ, level } = params;

    let enemyList = Character.enemyList;
    if (environ) {
      enemyList = enemyList.filter(enemy => enemy.environments.includes(environ));
    }

    if (enemyList.length === 0) {
      return;
    }

    const enemy = getRandomChoice(enemyList);
    store.dispatch(newCharacter(
        'enemy'
      , enemy.name
      , getRandomInt(enemy.health.min, enemy.health.max)
      , false
      , enemy.skills
    ));

    enemy.abilities.forEach(a => {
      store.dispatch(receiveAbility('enemy', a));
    });

    store.dispatch(receiveExperience('enemy', enemy.experience));

    return enemy;
  }

}